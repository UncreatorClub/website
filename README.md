# Uncreator.club

The public homepage and registration experience for Uncreator.club: a club for creators and brands to find thoughtful opportunities, collaborations, and community.

The production site uses the **Split Zine** direction with the **Mango Disco** palette. It is a lightweight static site; shared form infrastructure is owned by the private workspace repository.

## What's in the project

- `index.html` — the production homepage. It contains the navigation, hero, opportunity sections, dark Internet Club leaderboard, footer, and registration dialog.
- `index1.html` — a layout and palette playground; do not treat it as the production page.
- `css/registration.css` — styles for the multi-step registration dialog.
- `js/registration.js` — client-side registration flow, validation, URL normalization, and form submission.
- `images/` — approved light and dark Uncreator.club logo variants.
- The shared backlog and Cloudflare Worker live in the private `UncreatorClub/workspace` repository.

## Run the homepage locally

The homepage has no build step. From the repository root, run a static server:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

On `localhost` or `127.0.0.1`, the page submits to a local Worker at
`http://127.0.0.1:8787`. In production it submits to
`https://workers.uncreator.club/submit`.

## Registration flow

Visitors choose either the Creator or Brand path. Each path has six steps and only its active fields are enabled for submission.

1. The browser validates the current step and normalizes supplied URLs.
2. `js/registration.js` sends JSON to the Worker's `/submit` endpoint.
3. The Worker checks the origin, payload type and size, honeypot field, shared fields, and persona-specific fields.
4. The Worker upserts the contact in AutoSend and adds it to the corresponding Creator or Brand list.

The Worker returns user-facing validation and failure messages; it never exposes the AutoSend API key to the browser.

Worker source, secrets, AutoSend list configuration, and deployment instructions
are maintained in `UncreatorClub/workspace`. The registration endpoint only
accepts `POST /submit` requests from an allowed website origin.

## Publish and verify

- Keep `index.html` as the approved production homepage.
- Review `UncreatorClub/workspace/TODO.md` before starting new work; it lists launch blockers, QA, and follow-up maintenance.
- Before publishing, test the homepage at mobile, tablet, and desktop widths; then verify keyboard use and current Chrome, Safari, and Firefox.
- Verify the workspace Worker deployment before publishing form-client changes.

## Design notes

`DESIGN.md` documents an earlier Vivid Momentum exploration. The current production direction is Split Zine / Mango Disco; use the existing production markup, styles, and approved logo variants as the source of truth until the production tokens are documented.
