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
const normalizeUrl = value => {
  const raw = clean(value);
  if (!raw) return '';
  const withProtocol = raw.startsWith('//')
    ? `https:${raw}`
    : /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(withProtocol);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
};
const cleanArray = value => Array.isArray(value) ? value.map(clean).filter(Boolean) : [];
const within = (value, allowed) => allowed.has(value);

const REFERRAL_SOURCES = new Set(['Instagram', 'LinkedIn', 'Friend', 'Creator', 'Brand Founder', 'Event', 'Other']);
const CREATOR_TOPICS = new Set(['Beauty', 'Wellness', 'Fashion', 'Food', 'Lifestyle', 'Parenting', 'Tech', 'Other']);
const CREATOR_IDENTITIES = new Set([
  'I love discovering products early',
  'I enjoy reviewing products',
  'I love sharing opinions',
  'I build communities',
  'I influence purchase decisions',
  'A mix of all of these',
]);
const CREATOR_INTERESTS = new Set(['Brand collaborations', 'Product testing', 'Community events', 'Creator networking', 'Feedback circles', 'UGC opportunities']);
const BRAND_CATEGORIES = new Set(['Beauty', 'Wellness', 'Fashion', 'Food & Beverage', 'Lifestyle', 'Home', 'Other']);
const BRAND_CHALLENGES = new Set(['More awareness', 'More trust', 'More content', 'Product launch', 'Community building', 'Understanding customer perception', 'Creator partnerships', 'Other']);
const BRAND_STAGES = new Set(["Customers don't know us", "Customers know us but don't trust us", "Customers like us but don't buy", "We don't know what customers think", "We're launching something new"]);
const NEXT_STEPS = new Set(['Book Discovery Call', 'Join Waitlist']);

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
    if (!contentType.includes('application/json') || contentLength > 65536) {
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
    if (clean(input.companyFax)) {
      return json({ ok: true }, 200, origin);
    }

    const name = clean(input.name).slice(0, 100);
    const email = clean(input.email).toLowerCase().slice(0, 254);
    const persona = clean(input.persona);
    const referralSource = clean(input.referralSource);

    if (name.length < 2 || !validEmail(email) || !['Creator', 'Brand'].includes(persona) || !within(referralSource, REFERRAL_SOURCES)) {
      return json({ ok: false, error: 'Please check your details and try again.' }, 422, origin);
    }

    const customFields = {
      persona,
      referralSource,
      source: 'Uncreator.club registration form',
      submittedAt: new Date().toISOString(),
    };

    if (persona === 'Creator') {
      const instagram = clean(input.instagram).slice(0, 200);
      const city = clean(input.city).slice(0, 120);
      const creatorTopics = cleanArray(input.creatorTopics);
      const creatorIdentity = clean(input.creatorIdentity);
      const creatorInterests = cleanArray(input.creatorInterests);
      const creatorLinkInputs = cleanArray(input.creatorLinks);
      const creatorLinks = creatorLinkInputs.map(normalizeUrl);
      const followerInput = clean(input.instagramFollowers);
      const instagramFollowers = followerInput === '' ? null : Number(followerInput);

      if (
        !instagram || !city || !creatorTopics.length || creatorTopics.some(value => !within(value, CREATOR_TOPICS)) ||
        !within(creatorIdentity, CREATOR_IDENTITIES) || !creatorInterests.length || creatorInterests.some(value => !within(value, CREATOR_INTERESTS)) ||
        creatorLinks.some(value => !value) ||
        (instagramFollowers !== null && (!Number.isSafeInteger(instagramFollowers) || instagramFollowers < 0))
      ) {
        return json({ ok: false, error: 'Please check your creator details and try again.' }, 422, origin);
      }

      Object.assign(customFields, {
        instagram,
        city,
        creatorTopics: creatorTopics.join(' | '),
        creatorIdentity,
        creatorInterests: creatorInterests.join(' | '),
        creatorLinks: creatorLinks.join('\n'),
      });
      if (instagramFollowers !== null) customFields.instagramFollowers = instagramFollowers;
    } else {
      const brandName = clean(input.brandName).slice(0, 160);
      const brandWebsite = normalizeUrl(clean(input.brandWebsite).slice(0, 500));
      const brandCategory = clean(input.brandCategory);
      const brandChallenges = cleanArray(input.brandChallenges);
      const brandPerceptionStage = clean(input.brandPerceptionStage);
      const preferredNextStep = clean(input.preferredNextStep);

      if (
        !brandName || !brandWebsite || !within(brandCategory, BRAND_CATEGORIES) ||
        !brandChallenges.length || brandChallenges.some(value => !within(value, BRAND_CHALLENGES)) ||
        !within(brandPerceptionStage, BRAND_STAGES) || !within(preferredNextStep, NEXT_STEPS)
      ) {
        return json({ ok: false, error: 'Please check your brand details and try again.' }, 422, origin);
      }

      Object.assign(customFields, { brandName, brandWebsite, brandCategory, brandChallenges: brandChallenges.join(' | '), brandPerceptionStage, preferredNextStep });
    }

    if (!env.AUTOSEND_API_KEY) {
      console.error('AUTOSEND_API_KEY is not configured');
      return json({ ok: false, error: 'Submissions are temporarily unavailable.' }, 503, origin);
    }

    const listId = persona === 'Creator' ? env.AUTOSEND_CREATOR_LIST_ID : env.AUTOSEND_BRAND_LIST_ID;

    const autoSendResponse = await fetch('https://api.autosend.com/v1/contacts/email', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AUTOSEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName: name,
        customFields,
        ...(listId ? { listIds: [listId] } : {}),
      }),
    });

    if (!autoSendResponse.ok) {
      console.error('AutoSend contact upsert failed', autoSendResponse.status);
      return json({ ok: false, error: 'We could not save your request. Please try again.' }, 502, origin);
    }

    // AutoSend's upsert endpoint accepts listIds, but an explicit list add makes
    // membership reliable for both newly created and previously existing contacts.
    if (listId) {
      const listResponse = await fetch('https://api.autosend.com/v1/contact-lists/contacts/bulk-add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.AUTOSEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactListId: listId, emails: [email] }),
      });
      const listResult = await listResponse.json().catch(() => ({}));
      if (!listResponse.ok || !listResult.success || listResult.data?.errors?.length) {
        console.error('AutoSend list membership failed', listResponse.status);
        return json({ ok: false, error: 'We could not save your request. Please try again.' }, 502, origin);
      }
    }

    return json({ ok: true }, 200, origin);
  },
};
