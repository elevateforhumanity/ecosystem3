import type { Handler } from '@netlify/functions';
import fetch, { RequestInit } from 'node-fetch';

const TIMEOUT_MS = 5000;

export const handler: Handler = async (event) => {
  const subpath = (event.path || '').replace(/^\/api\//, '');
  const replitUrl = process.env.REPLIT_BASE_URL ? `${process.env.REPLIT_BASE_URL}/api/${subpath}` : null;
  const supabaseUrl = `${process.env.SUPABASE_URL}/functions/v1/api/${subpath}`;

  const init: RequestInit = {
    method: event.httpMethod,
    headers: { 
      'Content-Type': event.headers['content-type'] || 'application/json', 
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE}` 
    },
    body: ['GET','HEAD'].includes(event.httpMethod) ? undefined : event.body
  };

  // Try Replit first (if configured)
  if (replitUrl) {
    try {
      console.log(`Trying Replit: ${replitUrl}`);
      const r = await fetchWithTimeout(replitUrl, init, TIMEOUT_MS);
      if (r.ok) {
        console.log(`Replit success for ${subpath}`);
        return { 
          statusCode: r.status, 
          headers: Object.fromEntries(r.headers), 
          body: await r.text() 
        };
      }
      console.log(`Replit failed with status ${r.status}, falling back to Supabase`);
    } catch (error) {
      console.log(`Replit error for ${subpath}, falling back to Supabase:`, error.message);
    }
  }

  // Fail over to Supabase Edge Function
  try {
    console.log(`Trying Supabase: ${supabaseUrl}`);
    const r2 = await fetchWithTimeout(supabaseUrl, init, TIMEOUT_MS);
    return { 
      statusCode: r2.status, 
      headers: Object.fromEntries(r2.headers), 
      body: await r2.text() 
    };
  } catch (error) {
    console.error(`Both Replit and Supabase failed for ${subpath}:`, error);
    return {
      statusCode: 503,
      body: 'Service temporarily unavailable',
      headers: { 'Content-Type': 'text/plain' }
    };
  }
};

function fetchWithTimeout(url: string, init: RequestInit, ms: number) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(t));
}