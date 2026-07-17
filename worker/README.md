# Uncreator.club form Worker

This Worker receives invite requests from the public website and upserts the
contact into the Uncreator.Club project in AutoSend.

Cloudflare Workers Builds deploys this directory from the repository's `main`
branch. The Worker expects one encrypted secret in Cloudflare:

- `AUTOSEND_API_KEY` — the AutoSend project API key.

Production deployments are triggered automatically whenever `worker/` changes
on `main`; the Cloudflare dashboard is not the source of truth for Worker code.

Local development:

```sh
npm install
npx wrangler secret put AUTOSEND_API_KEY
npm run dev
```
