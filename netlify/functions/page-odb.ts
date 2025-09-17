import { builder, Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const handler: Handler = async (event) => {
  const path = (event.path || '/').replace(/^\/page\//, '') || 'index';

  try {
    const rsp = await fetch(process.env.SUPABASE_URL + '/functions/v1/render', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ path, site_id: 'main' })
    });

    if (!rsp.ok) {
      console.error(`Render failed for path ${path}: ${rsp.status} ${await rsp.text()}`);
      return { 
        statusCode: rsp.status, 
        body: `Render failed: ${rsp.status}`,
        headers: { 'Content-Type': 'text/plain' }
      };
    }

    const html = await rsp.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400'
      },
      body: html
    };
  } catch (error) {
    console.error(`Error rendering page ${path}:`, error);
    return {
      statusCode: 500,
      body: 'Internal server error',
      headers: { 'Content-Type': 'text/plain' }
    };
  }
};

export const handler = builder(handler);