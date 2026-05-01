export const config = {
  runtime: 'edge',
};

const TARGET = 'https://ar.besseralsnix.info';

export default async function handler(req) {
  const url = new URL(req.url);
  const targetUrl = TARGET + url.pathname + url.search;

  const headers = new Headers();
  for (const [k, v] of req.headers) {
    const lower = k.toLowerCase();
    if (['host', 'connection', 'transfer-encoding'].includes(lower)) continue;
    headers.set(k, v);
  }

  headers.set('host', 'ar.besseralsnix.info');

  const hasBody = !['GET', 'HEAD'].includes(req.method);

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: hasBody ? req.body : undefined,
    duplex: 'half',
  });

  const resHeaders = new Headers();
  for (const [k, v] of upstream.headers) {
    if (k.toLowerCase() === 'transfer-encoding') continue;
    resHeaders.set(k, v);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}
