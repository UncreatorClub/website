# Uncreator.club form Worker

This Worker receives creator and brand registrations from the public website,
validates each path independently, and upserts the contact into the
Uncreator.Club project in AutoSend. Creator and brand records are also added to
their dedicated AutoSend lists.

Cloudflare Workers Builds deploys from the repository root on the `main`
branch. The root `wrangler.jsonc` points to `worker/src/index.js`. The Worker
expects one encrypted secret in Cloudflare:

- `AUTOSEND_API_KEY` — the AutoSend project API key.

The non-secret list IDs are versioned in the root `wrangler.jsonc` as
`AUTOSEND_CREATOR_LIST_ID` and `AUTOSEND_BRAND_LIST_ID`.

Production deployments are triggered automatically whenever `worker/` changes
on `main`; the Cloudflare dashboard is not the source of truth for Worker code.

Local development:

```sh
npm install
npx wrangler secret put AUTOSEND_API_KEY
npm run dev
```
