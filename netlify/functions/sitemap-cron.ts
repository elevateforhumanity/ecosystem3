import type { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

// Triggers a GitHub repository_dispatch on Elevate-sitemap to regenerate sitemaps.
// Store GITHUB_TOKEN_REPO (a classic PAT with workflow scope) in Netlify env.
export const handler: Handler = async () => {
  const repo = 'elevateforhumanity/Elevate-sitemap';
  const eventType = 'regenerate-sitemaps';
  
  if (!process.env.GITHUB_TOKEN_REPO) {
    console.error('GITHUB_TOKEN_REPO not configured');
    return { 
      statusCode: 500, 
      body: 'GitHub token not configured',
      headers: { 'Content-Type': 'text/plain' }
    };
  }

  try {
    console.log(`Triggering sitemap regeneration for ${repo}`);
    const r = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN_REPO}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ event_type: eventType })
    });
    
    if (!r.ok) {
      const errorText = await r.text();
      console.error(`GitHub dispatch failed: ${r.status} ${errorText}`);
      return { 
        statusCode: r.status, 
        body: `GitHub dispatch failed: ${errorText}`,
        headers: { 'Content-Type': 'text/plain' }
      };
    }
    
    console.log('Sitemap regeneration triggered successfully');
    return { 
      statusCode: 200, 
      body: 'Sitemap regeneration triggered',
      headers: { 'Content-Type': 'text/plain' }
    };
  } catch (error) {
    console.error('Error triggering sitemap regeneration:', error);
    return {
      statusCode: 500,
      body: 'Internal server error',
      headers: { 'Content-Type': 'text/plain' }
    };
  }
};