import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import type { Handler } from '@netlify/functions';
import { Readable } from 'stream';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
  }
});

export const handler: Handler = async (event) => {
  const key = (event.path || '').replace(/^\/assets\//, '');
  if (!key) {
    return { 
      statusCode: 400, 
      body: 'Missing key',
      headers: { 'Content-Type': 'text/plain' }
    };
  }

  try {
    const obj = await s3.send(new GetObjectCommand({ 
      Bucket: process.env.R2_BUCKET!, 
      Key: key 
    }));
    
    const bodyStream = obj.Body as unknown as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of bodyStream) {
      chunks.push(Buffer.from(chunk));
    }
    const buf = Buffer.concat(chunks);
    
    const ct = obj.ContentType || 'application/octet-stream';
    const isText = ct.startsWith('text/') || ct.includes('xml') || ct.includes('json');
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': ct, 
        'Cache-Control': 'public, max-age=604800, immutable' 
      },
      body: isText ? buf.toString('utf8') : buf.toString('base64'),
      isBase64Encoded: !isText
    };
  } catch (error) {
    console.error(`R2 proxy error for key ${key}:`, error);
    return { 
      statusCode: 404, 
      body: 'Not found',
      headers: { 'Content-Type': 'text/plain' }
    };
  }
};