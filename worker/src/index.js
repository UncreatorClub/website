const ALLOWED_ORIGINS = new Set([
  'https://beta.uncreator.club',
  'https://uncreator.club',
  'https://www.uncreator.club',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
]);

const json = (body, status = 200, origin = '') => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  };

  if (ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }

  return new Response(JSON.stringify(body), { status, headers });
};

const clean = value => typeof value === 'string' ? value.trim() : '';
const validEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/health') {
      return json({ ok: true }, 200, origin);
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return json({ ok: false, error: 'Origin not allowed.' }, 403);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
          Vary: 'Origin',
        },
      });
    }

    if (request.method !== 'POST' || url.pathname !== '/submit') {
      return json({ ok: false, error: 'Not found.' }, 404, origin);
    }

    const contentType = request.headers.get('Content-Type') || '';
    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (!contentType.includes('application/json') || contentLength > 8192) {
      return json({ ok: false, error: 'Invalid request.' }, 400, origin);
    }

    let input;
    try {
      input = await request.json();
    } catch {
      return json({ ok: false, error: 'Invalid request.' }, 400, origin);
    }

    // Bots commonly fill visually hidden fields; successful-looking responses
    // prevent them from repeatedly probing the form.
    if (clean(input.website)) {
      return json({ ok: true }, 200, origin);
    }

    const name = clean(input.name).slice(0, 100);
    const email = clean(input.email).toLowerCase().slice(0, 254);
    const persona = clean(input.persona);

    if (name.length < 2 || !validEmail(email) || !['Creator', 'Brand'].includes(persona)) {
      return json({ ok: false, error: 'Please check your details and try again.' }, 422, origin);
    }

    if (!env.AUTOSEND_API_KEY) {
      console.error('AUTOSEND_API_KEY is not configured');
      return json({ ok: false, error: 'Submissions are temporarily unavailable.' }, 503, origin);
    }

    const autoSendResponse = await fetch('https://api.autosend.com/v1/contacts/email', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AUTOSEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName: name,
        customFields: {
          persona,
          source: 'Uncreator.club invite form',
          submittedAt: new Date().toISOString(),
        },
      }),
    });

    if (!autoSendResponse.ok) {
      console.error('AutoSend contact upsert failed', autoSendResponse.status);
      return json({ ok: false, error: 'We could not save your request. Please try again.' }, 502, origin);
    }

    return json({ ok: true }, 200, origin);
  },
};
