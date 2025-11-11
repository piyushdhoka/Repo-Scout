// Serverless proxy to GitHub API for Vercel
// Accepts any path after /api/github/* and forwards to https://api.github.com/*

export default async function handler(req, res) {
  try {
    // Reconstruct the path from catch-all route
    const pathParam = (req.query.path || []).join('/');
    
    // Remove 'path' from query and preserve all other query parameters
    const queryParams = { ...req.query };
    delete queryParams.path;
    
    // Build query string
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `https://api.github.com/${pathParam}${queryString ? `?${queryString}` : ''}`;

    console.log('GitHub API Proxy:', req.method, url);

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Repo-Scout-App'
    };

    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No GITHUB_TOKEN found - API rate limits will be restricted');
    }

    // Build fetch options mirroring the incoming request
    const options = {
      method: req.method,
      headers
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, options);
    
    // Forward rate limit headers to client
    const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
    const rateLimitReset = response.headers.get('x-ratelimit-reset');
    
    if (rateLimitRemaining) {
      res.setHeader('X-RateLimit-Remaining', rateLimitRemaining);
    }
    if (rateLimitReset) {
      res.setHeader('X-RateLimit-Reset', rateLimitReset);
    }

    const contentType = response.headers.get('content-type') || '';

    res.status(response.status);
    
    // Handle rate limiting
    if (response.status === 403 && rateLimitRemaining === '0') {
      return res.json({ 
        error: 'GitHub API rate limit exceeded',
        resetAt: rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toISOString() : null
      });
    }

    // Pass through JSON and text content; fallback to raw text
    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    } else {
      const text = await response.text();
      res.setHeader('Content-Type', contentType || 'text/plain');
      res.send(text);
    }
  } catch (err) {
    console.error('GitHub proxy error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch from GitHub', 
      details: String(err?.message || err) 
    });
  }
}
