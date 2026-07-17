# Uncreator.Club Backlog

This is the working list for improvements that can be picked up one at a time.

## How to use this list

- Pick one item from **Up next**.
- Change `[ ]` to `[~]` while it is in progress.
- Change `[~]` to `[x]` when its acceptance criteria are complete.
- Move completed items to **Done** with the completion date.
- Keep tasks small enough to finish and verify in one focused pass.

## Up next

### P0 - Publish the approved homepage

- [ ] Commit and push the current Split Zine homepage, logo variants, and dark leaderboard to `main`.
  - Acceptance: only the intended homepage and logo files are committed.
  - Acceptance: `main` and `origin/main` point to the same commit.

### P1 - Make the invite form real

- [ ] Add stronger rate limiting and duplicate-submission protection.
  - The deployed form already includes an origin allowlist and honeypot field.
  - Acceptance: repeated automated submissions are rate-limited.
  - Acceptance: legitimate users receive a helpful response.

### P1 - Complete navigation and contact paths

- [ ] Replace placeholder social-media links in `index.html`.
  - Acceptance: Instagram and LinkedIn open the correct profiles.

- [ ] Confirm the public contact email and update every email link.
  - Acceptance: all `mailto:` links use the approved address.

- [ ] Review every CTA and navigation link.
  - Acceptance: there are no placeholder `href="#"` links.
  - Acceptance: each CTA leads to the expected section or action.

### P1 - Search and sharing

- [ ] Add complete SEO metadata to the production homepage.
  - Include canonical URL, title, description, robots, and theme color.
  - Acceptance: metadata describes the approved Split Zine homepage.

- [ ] Add favicon and mobile home-screen icons using the approved brand assets.
  - Acceptance: icons appear correctly in modern desktop and mobile browsers.

- [ ] Create an Open Graph/social-sharing image.
  - Acceptance: link previews on social and messaging platforms use the approved brand direction.

### P1 - Quality assurance

- [ ] Test the production homepage at common mobile, tablet, and desktop widths.
  - Check navigation, logo cropping, hero composition, leaderboard, CTAs, form, and footer.
  - Acceptance: there is no clipped text, unintended overflow, or overlapping content.

- [ ] Complete a keyboard and screen-reader accessibility pass.
  - Check focus order, visible focus states, dialog behavior, labels, contrast, and reduced motion.
  - Acceptance: all interactive elements can be operated without a mouse.

- [ ] Test the homepage in current Chrome, Safari, and Firefox.
  - Acceptance: the approved design and core interactions work consistently.

### P2 - Code and maintenance

- [ ] Remove duplicated production styles and markup from `index.html` and `index1.html`.
  - Keep `index.html` as the approved production homepage.
  - Keep `index1.html` as the layout and palette playground.
  - Acceptance: shared changes do not need to be made twice.

- [ ] Decide whether the older Tailwind implementation is still needed.
  - Review `css/style.css`, `js/script.js`, and `js/tailwind-config.js`.
  - Acceptance: unused legacy code is documented or removed safely.

- [ ] Update `README.md` to match the current repository.
  - Replace outdated references to `code.html` and `screen.png`.
  - Document `index.html`, `index1.html`, the logo variants, and the local preview workflow.
  - Acceptance: every documented file and command is current and valid.

- [ ] Document the production design tokens.
  - Record the Mango Disco palette, typography, spacing, and logo-variant rules.
  - Acceptance: future changes can follow the selected visual system without inspecting the full HTML.

### P2 - Content and trust

- [ ] Replace sample leaderboard data with approved real or clearly labeled illustrative data.
  - Acceptance: public-facing claims are accurate and authorized.

- [ ] Review all homepage copy with the creative and business teams.
  - Acceptance: headline, positioning, statistics, testimonials, and opportunity descriptions are approved.

- [ ] Add privacy and terms pages before collecting real submissions.
  - Acceptance: the form links to both policies and explains how submitted data is used.

## Later

- [ ] Add lightweight, privacy-conscious analytics.
- [ ] Add campaign or opportunity detail pages.
- [ ] Add a creator application status flow.
- [ ] Add a brand discovery-session scheduling flow.
- [ ] Add a small content system for opportunities and community events.
- [ ] Add automated HTML, link, accessibility, and deployment checks.

## Done

- [x] Rebuilt registration as separate six-step creator and brand flows, added repeatable creator links, configured the AutoSend property schema and dedicated lists, and verified both paths end to end. (2026-07-18)
- [x] Connected the invite form to AutoSend through a GitHub-deployed Cloudflare Worker, with loading, success, failure, validation, and honeypot handling. (2026-07-18)
- [x] Created the initial homepage layout and palette playground. (2026-07-18)
- [x] Selected Split Zine with Mango Disco for the production homepage. (2026-07-18)
- [x] Added the Internet Club leaderboard to Split Zine. (2026-07-18)
- [x] Added light and dark logo variants. (2026-07-18)
- [x] Styled the Split Zine leaderboard in dark mode. (2026-07-18)
