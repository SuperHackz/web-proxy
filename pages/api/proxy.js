export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const options = {
      method: req.method,
      headers: req.headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
    };

    const response = await fetch(targetUrl, options);
    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch target URL', details: err.message });
  }
}
