// Serverless proxy to GitHub API for Vercel
// Accepts any path after /api/github/* and forwards to https://api.github.com/*

export default async function handler(req, res) {
  try {
    const pathParam = (req.query.path || []).join('/');
    const url = `https://api.github.com/${pathParam}`;

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Repo-Scout-App'
    };

    const token = process.env.GITHUB_TOKEN;
    if (token) headers['Authorization'] = `Bearer ${token}`;

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
    const contentType = response.headers.get('content-type') || '';

    res.status(response.status);
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
    res.status(500).json({ error: 'Failed to fetch from GitHub', details: String(err?.message || err) });
  }
}
