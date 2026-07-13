# Summit Chronicles Project Comparison and Improvement Report

Date: 2026-07-07

## Scope

This report compares the local workspace at `/Users/sunith/Documents/summit-chronicles-starter` against `summitchronicles/summitchronicles-site`, then assesses the project through product, UI/UX, accessibility, frontend architecture, AI experience, content, SEO, security, performance, UI UX Pro Max, and 21st.dev component-fit lenses.

After clarification, UI UX Pro Max was reviewed from `https://ui-ux-pro-max-skill.nextlevelbuilder.io/` and its linked GitHub repository, `nextlevelbuilder/ui-ux-pro-max-skill`. It is not installed as a local Codex skill in this workspace, but its public design-intelligence framework is now applied directly in this report.

## Executive Summary

The local project is not behind GitHub. It is the same tracked code as GitHub `main`.

- Local branch: `main`
- Local `HEAD`: `7cfa8e9f5e3ffd69ebed31f424e625d35daf22ce`
- Remote repo: `https://github.com/summitchronicles/summitchronicles-site`
- Remote cloned `HEAD`: `7cfa8e9f5e3ffd69ebed31f424e625d35daf22ce`
- Tracked files: 899 local, 899 remote
- Tracked diff against `origin/main`: none
- Local untracked state: `.codex/` only

The codebase is technically healthy enough to build, but the user experience is not yet at the same level as the feature ambition. The main gap is not missing features; it is coherence. The app has many strong pieces: immersive imagery, training telemetry, a modular monolith refactor, internal route hardening, content tooling, AI/RAG code, and dashboards. Those pieces are not yet presented as a simple, trustworthy, consistently navigable product.

The highest-leverage improvements are:

1. Make first viewports readable and decisive.
2. Restore semantic page structure and shared layout.
3. Wire the visible AI assistant to the real AI/RAG surface.
4. Consolidate design tokens and eliminate undefined/legacy CSS paths.
5. Fix route, image, and content truth drift.
6. Apply UI UX Pro Max design-system reasoning to choose the correct visual pattern before selecting components.
7. Use 21st.dev elements selectively for complete patterns, not decoration.

## Verification Performed

Commands run successfully:

- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run eval:core`: 10 suites passed, 38 tests passed
- `npm run build`: passed

Build output:

- Next.js 16.1.6
- 73 app routes generated/registered
- Proxy middleware active

Build warning to fix:

- Next inferred workspace root from `/Users/sunith/bun.lock` instead of the project package lock. Set `outputFileTracingRoot` in `next.config.mjs` or remove the parent lockfile if it is not intentional.

Browser-rendered pages inspected:

- `/`
- `/training`
- `/ai-search`
- `/expeditions`
- `/support`
- mobile homepage and mobile menu at `390x844`

External design references inspected:

- UI UX Pro Max landing page: `https://ui-ux-pro-max-skill.nextlevelbuilder.io/`
- UI UX Pro Max GitHub README: `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`
- 21st.dev: `https://21st.dev/`
- 21st.dev MCP page: `https://21st.dev/mcp`

## Project Strengths

### Technical Foundation

- Modern Next.js App Router stack with Next 16, React 19, TypeScript, Tailwind, Framer Motion, SWR, Sanity, Supabase, OpenAI/Gemini/Replicate integrations, and internal route hardening.
- Modular monolith direction is documented and partially implemented under `modules/*` and `shared/*`.
- Security hardening is better than typical early-stage sites: internal API gates, stricter headers, upload validation, monitoring payload constraints, and removal of git operations from HTTP routes.
- Training read model has moved toward durable persisted summaries, which is the right architecture for low-cost hosting and provider resilience.
- Core evals exist and pass.

### Product Assets

- The site has real brand material: strong mountaineering imagery, a clear Seven Summits/Everest narrative, recovery/training angle, sponsor/support surfaces, and blog/content tooling.
- The training system is differentiated. Live Intervals data plus weekly mission logs can become the strongest unique experience on the site.
- There is enough content and tooling to support both a public audience and internal publishing workflows.

### UX Direction

- The current cinematic obsidian/gold direction is more distinctive than the older "Swiss Spa" light design concept.
- Large imagery is a good fit for the subject matter.
- Mobile touch targets in the header are mostly sized correctly.

## GitHub Comparison Findings

Because local and remote tracked code are identical, the comparison outcome is:

- No code has to be ported from GitHub to local.
- No local tracked work is ahead of GitHub.
- Every issue below applies to the current GitHub `main` branch as well.

The practical difference is environmental:

- Local has `node_modules`, `.next`, `out`, reports, generated files, and other ignored/generated state.
- GitHub clone has only tracked source.
- Local has untracked `.codex/config.toml`.

## Priority Gap Analysis

### P0: First Viewports Are Too Low-Contrast

Evidence:

- Homepage desktop renders a beautiful full-screen image, but the "Summit Chronicles" ghost title is nearly invisible at rest.
- Homepage mobile renders as an image with only a small logo/menu; the title and CTA are effectively hidden until lower in the viewport.
- Expeditions opens with a dark atmospheric image and "TIMELINE" cue; the page title is not visually legible in the first viewport.
- Support opens with the conversion content, but the main headline is too faint against the image.
- Training repeats the same ghost-type issue.

Impact:

- Users cannot immediately answer: "Where am I? What is this? What should I do?"
- The site depends on nav text to carry the brand instead of the hero.
- This hurts accessibility, conversion, sponsor confidence, and AI/SEO landing quality.

Recommended fix:

- Keep the immersive image style, but replace ghost-only hero titles with readable display type plus a controlled overlay.
- Use a max two-line hero system:
  - Eyebrow: mission/status
  - H1: page-specific title
  - Supporting copy: one sentence
  - Primary CTA and secondary CTA
- Reserve ghost typography for decorative backing text, not primary meaning.

Acceptance criteria:

- Every public landing page has a visible H1 in the first viewport.
- Body copy and headings meet WCAG AA contrast.
- Mobile first viewport shows brand/title/CTA without hover.

### P0: Visible AI Assistant Is Simulated

Evidence:

- `app/components/ai/FloatingAIButton.tsx` uses a timeout and returns a canned assistant response.
- `/ai-search` uses real RAG endpoints, but the page showed disabled input while checking status.
- Local `/api/ai/status` returns:
  - `provider: "replicate"`
  - `knowledgeBase.totalDocuments: 0`
  - `capabilities.semanticSearch: true`
  - `capabilities.ragResponses: false`
- `/ai-search` copy says processing happens locally using Ollama, but runtime status says Replicate.
- `app/api/ai/status/route.ts` is internal-gated, while `SmartSearch` calls it from a public page.

Impact:

- The most visible AI entry point is not the real AI product.
- Users can lose trust when "AI" gives a canned answer or a disabled search box.
- Production behavior can diverge from local because internal API auth differs by environment.

Recommended fix:

- Make `FloatingAIButton` call the same real API surface as `SmartSearch`.
- Create a public-safe `/api/ai/public-status` endpoint that exposes only capability readiness, not operational internals.
- Update copy to match actual provider behavior.
- Do not show "AI ready" unless there is at least one indexed knowledge source or a direct model fallback is clearly labeled.
- Add empty states:
  - "Knowledge base not indexed yet"
  - "Direct assistant available"
  - "Training data unavailable"

Acceptance criteria:

- Floating assistant and `/ai-search` share one backend contract.
- No canned response ships as the default AI experience.
- Public AI page works in production without internal credentials.
- Provider/privacy copy is accurate.

### P0: Shared Layout and Semantics Are Inconsistent

Evidence:

- `Footer` exists but is unused across app routes.
- Pages manually import `Header` rather than using a shared public layout.
- Several high-value public pages inspected or grepped do not use a `<main>` wrapper.
- `support/page.tsx` uses an eyebrow as `h1` and the visible page title as `h2`.
- `training/page.tsx` has no visible/semantic H1 in the successful state; its H1 only appears in the error state inside `TrainingRedesignPrototype`.
- Header mobile menu opens as a partial overlay and leaves underlying hero content visible underneath.

Impact:

- Inconsistent keyboard/screen-reader structure.
- Missing footer means legal, newsletter, contact, and secondary discovery paths are absent.
- Pages feel like individual prototypes rather than one coherent product.
- Mobile menu layering feels unfinished.

Recommended fix:

- Introduce `PublicLayout` with skip link, header, `<main id="main-content">`, footer, and floating AI slot.
- Convert public pages to use it.
- Use one heading rule: one H1 per page, visually present unless there is a deliberate accessible equivalent.
- Make mobile nav a full-height drawer or sheet with body scroll lock.

Acceptance criteria:

- All public pages have exactly one H1 and one main landmark.
- Footer appears on public pages except deliberately full-screen tools.
- Mobile menu covers/owns the navigation state cleanly.

### P1: Design System Drift

Evidence:

- `docs/design/DESIGN_SYSTEM.md` describes "Swiss Spa Minimalism" with light neutrals and alpine blue.
- Current public pages are cinematic obsidian/gold, Red Bull-inspired, and mission-control themed.
- Tailwind includes many palettes: alpine blue, obsidian, summit gold, spa stone, glacier, peak, forest, expedition, weather, altitude, season.
- `app/globals.css` defines utilities that reference undefined CSS variables:
  - `--gradient-peak`
  - `--gradient-summit`
  - `--gradient-elevation`
  - `--gradient-accent`
- Pages such as `/ai-search`, `/admin`, `/blog/dynamic`, `/insights`, and `/my-story` use `gradient-peak`, which can silently fail.
- `/ai-search` visually mixes light-theme text on a dark background.

Impact:

- Components are visually inconsistent and hard to maintain.
- Undefined CSS variables create unpredictable backgrounds.
- Light and dark token mixing creates contrast failures.

Recommended fix:

- Decide the current brand system:
  - Primary: obsidian, snow, summit gold
  - Secondary: glacier blue for data/links
  - Status: green/amber/red
  - Surface: black, zinc, translucent panels
- Rewrite design docs to reflect current direction.
- Remove or quarantine legacy Swiss Spa tokens, or explicitly map them to dark equivalents.
- Replace undefined gradient utilities with real tokens or remove them.

Acceptance criteria:

- No CSS utility references an undefined variable.
- `/design-system` shows the same aesthetic as the public app.
- Dark/light token usage is explicit and tested.

### P1: Route and Information Architecture Drift

Evidence:

- App has 41 page routes and 36 API routes.
- Primary nav exposes only Home, About, Expeditions, Training, Stories, Partnerships, Support.
- There are overlapping public routes:
  - `/support`
  - `/sponsorship`
  - `/partnerships`
  - `/media-kit`
  - `/speaking`
  - `/connect`
  - `/newsletter`
- `next.config.mjs` redirects `/ask` to `/ask-sunith`, but no `/ask-sunith` route exists.
- `next.config.mjs` has cache headers for `/api/health` and `/api/analytics/dashboard`, but those routes do not exist in the current app tree.

Impact:

- Users have no clear mental model for sponsor/support/partnership paths.
- Redirects can create 404s.
- Operational routes and marketing routes are not clearly separated.

Recommended fix:

- Define a simple IA:
  - Journey: About, Expeditions, Stories
  - Training: Training, Live/Realtime
  - Support: Support, Partnerships, Sponsorship, Media Kit
  - Connect: Newsletter, Speaking, Contact
  - Internal: Dashboard, Studio, Admin
- Make one route the canonical conversion path for money/support, and link other pages into it.
- Fix stale redirects and route headers.

Acceptance criteria:

- No internal link or configured redirect points to a missing route.
- Sponsor/support pages have clear differentiated jobs.
- Public nav and footer expose the full intentional IA.

### P1: Content Truth Drift

Evidence:

- README says Next.js 14, Cohere, Buttondown, and Strava; package/code show Next.js 16, React 19, OpenAI/Gemini/Replicate, Resend, Sanity, Supabase, Intervals, and Garmin.
- README contains malformed/truncated sections.
- Dates conflict across app and docs:
  - Everest 2025 appears in `/my-story` and `/media-kit`.
  - Everest 2027 appears in training metrics and archive docs.
  - Everest 2028 appears in current homepage/newsletter/support/expeditions.
- `app/expeditions/page.tsx` contains factual/copy issues:
  - Elbrus story says Andes/South America.
  - `Rookund` should likely be `Roopkund`.
  - Several image paths use capitalization that does not match `public/images` and can break on Linux:
    - `/images/Spangnak.jpg` vs `spangnak.jpg`
    - `/images/Sandakphu.jpg` vs `sandakphu.jpg`
    - `/images/Brahmatal.jpg` vs `brahmatal.jpg`
    - `/images/Roopkund.jpg` vs `roopkund.jpg`
- Multiple components still use mock, placeholder, or "coming soon" content in public-facing surfaces.

Impact:

- Sponsors and serious readers will notice timeline/story contradictions.
- Deploy-only image breakage is likely.
- AI answers can inherit stale or incorrect context if docs/content are indexed.

Recommended fix:

- Create a single `content/truth.ts` or `data/site-facts.json` for:
  - Everest target date
  - completed summits
  - current recovery/training status
  - sponsor/support facts
  - public social links
- Replace hard-coded dates and claims with imports.
- Rewrite README as a current operator guide.
- Add tests for known image paths and internal links.

Acceptance criteria:

- One source controls Everest target timeline.
- Expedition image paths pass a case-sensitive existence check.
- README matches package and architecture.

### P1: Public AI and Training Data Need Trust States

Evidence:

- Training page displays `Intervals.icu Live` and summary cards, but the experience has no obvious source drill-down or freshness explanation in the first viewport.
- Training hero has no semantic H1.
- AI status reports zero knowledge base documents and RAG unavailable, while UI copy still promises curated knowledge.

Impact:

- The best differentiator, live training telemetry, needs clearer trust scaffolding.
- AI claims can overpromise relative to indexed data.

Recommended fix:

- Add a "Data confidence" pattern:
  - Live/cached/degraded
  - Last ingest
  - Source
  - What changed this week
  - Link to "how this data is collected"
- Add AI confidence and source badges consistently.
- Tie training and AI together: "Ask about this week" should include the selected mission log context.

### P2: Performance and Runtime Hygiene

Evidence:

- Many public routes are client components with heavy animation/image surfaces.
- Large components remain oversized:
  - `site-wireframes.ts`: 1425 lines
  - `ExpeditionTimeline.tsx`: 1087 lines
  - `PersonalStoryGallery.tsx`: 830 lines
  - `MagazineBlogEditor.tsx`: 798 lines
  - `app/expeditions/page.tsx`: 781 lines
- Build passes but emits workspace-root warning.

Impact:

- Bundle weight and hydration cost can rise quickly.
- Oversized components slow iteration and increase regression risk.

Recommended fix:

- Split large public components by section.
- Move static expedition data out of components.
- Prefer server components for static pages and isolate client islands only where interaction is needed.
- Add bundle budgets and route-level performance checks.

### P2: Test Coverage Should Gate UX Regressions

Existing tests are a good base, but the current gaps show what is not being gated.

Add tests for:

- Every public route has one visible H1 and one main landmark.
- Header/footer render on public pages.
- No internal links or redirects 404.
- No public image path is missing under case-sensitive matching.
- AI public status does not require internal auth.
- Floating AI calls the real API in tests.
- Visual snapshots for homepage, training, AI search, support, and expeditions at desktop and mobile.
- Contrast checks for hero text and AI search.

## UI UX Pro Max Lens

UI UX Pro Max describes itself as a design-intelligence skill for Claude Code, with a design-system generator, industry-specific reasoning rules, UI styles, color palettes, font pairings, chart recommendations, tech-stack guidance, UX guidelines, and anti-pattern checks.

For Summit Chronicles, the relevant UI UX Pro Max mapping is:

### Product Type

Summit Chronicles is not just a personal blog. It is a hybrid of:

- Storytelling-driven personal brand
- Trust-and-authority expedition platform
- Real-time monitoring/training dashboard
- Sponsor/support conversion page
- AI-native knowledge and assistant experience

The design system should therefore be a deliberate blend, not a single style preset.

### Recommended Page Patterns

- Homepage: Hero-Centric + Storytelling-Driven
- Expeditions: Storytelling-Driven + Editorial Grid
- Training: Real-Time Monitoring + Data-Dense Dashboard
- Support/Sponsorship/Partnerships: Trust & Authority + Conversion-Optimized
- AI Search/Floating AI: AI-Native UI + Source-Backed Assistant
- Blog/Stories: Editorial Grid / Magazine

### Recommended Style Families

Best-fit UI UX Pro Max styles for this project:

- Hero-Centric Design for the public landing pages.
- Storytelling-Driven for expedition and personal narrative pages.
- Trust & Authority for sponsor, media, speaking, and support pages.
- Real-Time Monitoring for training telemetry and live status.
- Data-Dense Dashboard for advanced training and internal dashboards.
- AI-Native UI for the assistant and search experience.
- Editorial Grid / Magazine for blog/story surfaces.
- Bento Grid for metric summaries and sponsor proof points.
- Accessible & Ethical as a non-negotiable baseline.

Styles to use carefully:

- HUD / Sci-Fi FUI fits the mission-control tone only when it does not reduce readability.
- Glassmorphism fits overlays and AI panels, but should not become the dominant surface treatment.
- Motion-Driven and Parallax Storytelling fit hero moments, but must respect reduced motion and mobile performance.

Styles to avoid:

- AI purple/pink gradient defaults.
- One-note dark blue/slate palettes.
- Decorative-only glass cards.
- Outline-only/ghost type as primary copy.
- Excessive cinematic darkness that hides content.

### Color Direction

Current obsidian/gold is directionally right for the subject. The palette should be tightened:

- Primary background: obsidian/black
- Primary text: snow/white
- Primary accent: summit gold
- Data accent: glacier blue
- Positive state: alpine green
- Warning state: amber
- Risk/error state: red
- Muted surfaces: zinc/charcoal

The current design mixes alpine-blue light-theme cards, spa-stone neutrals, and cinematic dark UI in ways that create contrast failures. UI UX Pro Max would treat this as a design-system mismatch, not an isolated component bug.

### Typography Direction

The current Oswald/condensed display type works for mountain poster energy, but it needs a supporting readable text system:

- Display: condensed expedition headline font, used sparingly.
- Body/UI: neutral sans with strong readability.
- Data labels: monospaced or tabular numeric style only where useful.
- Editorial long-form: optional serif only for article reading, not dashboards.

Rules:

- No hidden H1 as a substitute for visible page meaning.
- No negative letter spacing or viewport-scaled type for dense panels.
- No outline-only primary headings.

### Chart and Dashboard Direction

Training is the flagship product experience, so charting should be intentional:

- Current week: compact KPI strip.
- Trend: weekly load and elevation over time.
- Recovery: resting HR, sleep/readiness, and freshness state.
- Activity composition: stacked bars or small multiples.
- Mission arc: timeline/stepper, not decorative-only SVG.

Every chart needs:

- source label
- last updated timestamp
- degraded/cached/live state
- mobile fallback
- concise insight sentence

### UI UX Pro Max Pre-Delivery Checklist for This Project

- Visible H1 in every first viewport.
- Primary CTA visible without hover.
- Contrast meets WCAG AA.
- Focus states are visible.
- Clickable controls have pointer affordance and minimum touch target.
- Motion respects `prefers-reduced-motion`.
- Public AI surfaces disclose source/readiness.
- Public data surfaces disclose freshness.
- Mobile verified at 375-390px.
- Desktop verified at 1280px and 1440px.
- No mock/canned content appears as a production feature.

## 21st.dev Element Opportunities

21st.dev should be used here as a high-quality component source for complete interaction patterns, not as decoration. The project already has enough visual identity; the need is coherent, accessible, production-grade UI states.

Recommended 21st.dev-aligned element families:

### 1. Hero Sections

Use for:

- Homepage
- Expeditions
- Training
- Support
- Partnerships

Pattern:

- Full-bleed real image
- Readable H1
- Mission status strip
- Primary/secondary CTA
- Scroll cue
- Optional decorative ghost text only behind real readable text

### 2. AI Chat and Command Elements

Use for:

- Floating AI assistant
- `/ai-search`
- training contextual questions

Pattern:

- Chat shell with source cards
- Streaming/loading state
- Empty indexed-state warning
- Error state
- Confidence/source badges
- Suggested prompts as buttons

### 3. Navigation Menus and Mobile Sheets

Use for:

- Public nav with grouped sections
- Mobile menu
- Sponsor/support routes

Pattern:

- Full-height mobile sheet
- grouped nav sections
- footer CTA inside drawer
- no background content peeking through

### 4. Cards, Bento Grids, and Metrics

Use for:

- Training metrics
- Expedition cards
- support budget cards
- sponsor proof points

Pattern:

- consistent data card anatomy
- label, value, delta, source, timestamp
- responsive grid without layout shift

### 5. Tabs and Segmented Controls

Use for:

- Training: Mission Log, Sessions, Recovery, Trends
- AI Search: Search, Ask, Sources
- Support: Coffee, Gear, Expedition, Transparency

Pattern:

- clear active state
- keyboard-accessible tabs
- stable panel dimensions

### 6. Dialogs, Tooltips, and Empty States

Use for:

- AI explanation
- data source/freshness details
- support budget details
- admin/content confirmations

Pattern:

- source/freshness popovers
- degraded-data dialogs
- clear no-data states

### 7. Forms and Inputs

Use for:

- Newsletter
- support custom amount
- question submission
- admin content tools

Pattern:

- validation
- pending state
- success state
- error state
- privacy/source note

### 8. Tables and Dashboards

Use for:

- subscriber manager
- content dashboard
- agents dashboard
- training history

Pattern:

- dense data tables
- filters
- row actions
- loading skeletons
- empty state

Implementation guidance:

- Prefer shadcn-compatible 21st.dev components where possible.
- Do not import a component wholesale if it fights the brand system.
- Adapt tokens first, then component.
- Add one component family at a time and verify mobile/contrast.

## Recommended Roadmap

### Phase 1: Trust and Readability Sprint

Target: 1-2 weeks

Tasks:

- Use UI UX Pro Max reasoning to lock page patterns before visual changes:
  - Homepage: Hero-Centric + Storytelling-Driven
  - Training: Real-Time Monitoring + Data-Dense Dashboard
  - Support: Trust & Authority + Conversion-Optimized
  - AI Search: AI-Native UI + Source-Backed Assistant
- Fix hero readability on `/`, `/training`, `/expeditions`, `/support`.
- Add `PublicLayout` with `Header`, `main`, `Footer`, and floating AI slot.
- Wire `FloatingAIButton` to real AI API or hide it until ready.
- Fix `/ai-search` contrast and status behavior.
- Fix missing/stale redirects:
  - `/ask` should go to `/ai-search` or a real `/ask-sunith`.
  - Remove or create `/api/health`.
  - Remove or create `/api/analytics/dashboard`.
- Fix case-sensitive expedition image paths and copy errors.
- Update README to current architecture.

### Phase 2: Design System Consolidation

Target: 2-6 weeks

Tasks:

- Rewrite `docs/design/DESIGN_SYSTEM.md` using UI UX Pro Max's design-system output structure:
  - pattern
  - style family
  - color palette
  - typography
  - key effects
  - anti-patterns
  - pre-delivery checklist
- Remove undefined gradient utilities or define them.
- Create canonical page section primitives:
  - Hero
  - MetricCard
  - SourceBadge
  - CTAGroup
  - EmptyState
  - DataFreshness
- Introduce 21st.dev-inspired navigation sheet, tabs, cards, and AI chat patterns.
- Add route-level visual regression tests.

### Phase 3: Product Coherence

Target: 6-12 weeks

Tasks:

- Consolidate support/sponsorship/partnerships into a clear conversion funnel.
- Make Training the flagship product page:
  - live status
  - this week
  - mission log
  - session ledger
  - trends
  - ask about training
- Connect blog/story content to expedition and training pages.
- Build operator diagnostics for stale training ingests.
- Add public source transparency pages.

### Phase 4: Growth and SEO Layer

Target: after UX foundation

Tasks:

- Build structured topic hubs:
  - Everest 2028 preparation
  - Seven Summits progress
  - high-altitude training
  - recovery and return-to-mountain
  - gear and budget transparency
- Add schema per page type.
- Create AI-search-citable pages with clear facts and source blocks.
- Add analytics events for CTA, AI query, newsletter, support, and sponsor funnels.

## Detailed Backlog

### Accessibility

- Add a visible H1 to Training successful state.
- Change Support H1 from eyebrow to "Fuel the Ascent".
- Add `<main id="main-content">` to public routes.
- Keep skip link behavior in one shared layout.
- Add focus-visible states to custom CTAs.
- Ensure mobile nav traps focus while open and closes on Escape.

### Visual Design

- Increase hero title opacity and contrast.
- Stop relying on hover to reveal meaning.
- Avoid outline-only text for primary headings.
- Reduce one-off font sizing and tracking.
- Replace manual inline SVG heart in support with lucide icon for consistency.
- Normalize card radius and surfaces.

### AI

- Replace simulated floating assistant.
- Create public status endpoint.
- Separate internal operational status from public capability status.
- Index knowledge base before claiming RAG readiness.
- Show sources by default.
- Add "last indexed" and "source count".
- Remove inaccurate Ollama privacy copy unless local Ollama is truly used.

### Training

- Make Training hero semantically valid.
- Add a data freshness explanation component.
- Add degraded and cached states visible in UI, not only API payload.
- Let users switch between weekly mission logs, raw sessions, recovery, and trends.
- Add a "what changed this week" summary.

### Content

- Fix README.
- Fix expedition facts and image paths.
- Create single source of truth for timeline/status.
- Remove old Strava/Cohere/Buttondown claims where no longer current.
- Audit public "coming soon" and mock content.

### Infrastructure

- Set `outputFileTracingRoot`.
- Decide if parent `/Users/sunith/bun.lock` should influence this project.
- Add link/image integrity checks in CI.
- Add route smoke for redirects.

## Suggested Acceptance Gates

Before calling the next UX pass complete:

- `npm run typecheck`
- `npm run lint`
- `npm run eval:core`
- `npm run build`
- Playwright desktop/mobile visual smoke for `/`, `/training`, `/ai-search`, `/expeditions`, `/support`
- Automated checks:
  - no broken internal links
  - no missing public images
  - no public page without main landmark
  - no public page without visible H1
  - no undefined CSS custom properties in used utilities
  - no AI mock response in production path

## Bottom Line

Summit Chronicles already has the raw material for a strong product: real story, real data, real visuals, and real technical ambition. The improvement path is not "add more features." It is to make the existing system legible, trustworthy, and consistent.

The next best move is a focused UX foundation sprint: readable heroes, shared layout, real AI wiring, route/image truth cleanup, and design-token consolidation. After that, 21st.dev components can speed up polished interaction surfaces without diluting the brand.

## References

- GitHub repository: `https://github.com/summitchronicles/summitchronicles-site`
- UI UX Pro Max landing page: `https://ui-ux-pro-max-skill.nextlevelbuilder.io/`
- UI UX Pro Max GitHub repository: `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`
- 21st.dev: `https://21st.dev/`
- 21st.dev MCP: `https://21st.dev/mcp`
- Local docs reviewed:
  - `docs/architecture-upgrade-2026-03-08.md`
  - `docs/security-hardening-2026-03-08.md`
  - `docs/design/DESIGN_SYSTEM.md`
  - `docs/design/DESIGN_CONCEPTS.md`
- Key files reviewed:
  - `app/page.tsx`
  - `app/layout.tsx`
  - `app/globals.css`
  - `tailwind.config.js`
  - `next.config.mjs`
  - `app/components/organisms/Header.tsx`
  - `app/components/organisms/Footer.tsx`
  - `app/components/ai/FloatingAIButton.tsx`
  - `app/components/ai/SmartSearch.tsx`
  - `app/components/training/TrainingRedesignPrototype.tsx`
  - `app/expeditions/page.tsx`
  - `app/support/page.tsx`
