# Product Requirements Document (PRD): Unofficial Life in the UK

## High level description

### 1) Summary

A tongue-in-cheek, responsive website where visitors take a short quiz about “real” UK life and receive an instant score with witty feedback. The experience is lightweight, fast, and mobile-first.

**Pitch**:
Life in the UK is an official test you must pass to gain British citizenship. It's famous for having nothing to do with real life in the UK, to the point most of your British friends couldn't pass without studying.

Our ACTUAL Life in the UK test has no 1988 Olympics, no Tower of London construction:
only REAL classics from the REAL United Kingdom!

Could you become a UK citizen? Take the ACTUAL Life in the UK test and find out!

### 2) Goals & Non-Goals

**Goals**
Let users take a single quiz run (24 questions in MVP) and instantly see results.
Keep it fast, simple, and delightful (humour, contextual explanations).
Make it trivially shareable (social preview cards, share link with score, persona reveal).
Provide an easy path for players to submit feedback and new question ideas without having to create an account.
Require no signup; store nothing personally identifiable in MVP beyond an optional contact email passed straight through in feedback replies.

- Rely exclusively on free/open-source tooling or free SaaS tiers for the MVP (e.g., Astro, Cloudflare Pages free tier, Tailwind, pnpm, Plausible free tier, Resend free allotment); any paid upgrades are out of scope unless owners approve later.

**Non-Goals (MVP)**
No login, accounts, leaderboards, or payment.
No question authoring UI (the bank is static JSON in MVP).
No localisation beyond UK English.

### 3) Scope (MVP Features)

**Home page**: brief intro, one primary CTA: Big button on a Union Jack flag: TAKE THE TEST, brief disclaimer that it’s a parody of the official “Life in the UK” test. Footer carries subtle links to Ko-fi support and “Suggest a question / give feedback”.

**Quiz flow**: 24 questions per run, randomly sampled and shuffled per session from the bank of questions. (For launch we only have 24 authored questions, so every run currently uses the full set; the sampling mechanics stay in place so adding more questions later requires no product or code changes.)

**Question types supported in MVP**: Single choice, multiple choice, ranking, and free text short answers. Free text answers must trim whitespace, ignore case, tolerate simple punctuation differences, and support per-question synonym lists supplied by content editors.

**Navigation**: Next/Previous; “Finish” disabled until required questions are answered.

Visual progress (e.g., “Q 7 of 24”).

**Accessibility**: keyboard navigable, ARIA roles, focus states, sufficient contrast.

**Results page**:
Score (e.g., 0–10 or X/Y correct), pass/fail threshold (default 75%—configurable).

A breakdown list with each answered question, chosen answer(s), correctness, and the witty feedback from the bank (e.g., ranked supermarket poshness with the “correct order is…” explanation).

Celebratory treatment on success (“You’re as British as…”). Show a shareable “diploma” card that combines score, the relevant British persona comparison (e.g., Queen Elizabeth II for 100%, other personalities for lower brackets), and accompanying persona artwork.

“Retake test” + “Share your result” (copy link; optional Twitter/X share). Share card supports copy, social share, and download/screenshot prompts. Include contextual Ko-fi support link and a button to “Suggest a question / give feedback”.

**Analytics**: privacy-friendly page + event analytics (page view, start quiz, finish, share).

**SEO**: title/meta, open graph, sitemap, robots.txt.

**Feedback & Suggestions page**:
Linked from the home page footer and the success screen. Provides context plus a large free-text box for feedback/new questions (min. 200 character support) and a submit action, alongside an optional one-line email field. If a player enters their email, it’s included inside the forwarded message so you can reply; otherwise the submission is explicitly labelled as anonymous. Successful submission confirms on page and sends the payload to the project feedback inbox via a forwarding email address—no data is persisted after the email fires.

### 4) Question Bank (Source of Truth)

Source: QuestionBank.md

Each question includes:

id, type (single, multiple, rank, text), prompt, options (if any), correct (index/indices or ordered array for ranking), feedback (per option and/or per outcome), required (bool), tags (e.g., “food”, “language”), and any special rules (like “if answer < 1:30pm, mark as ‘optimistic—count it’”).

### 5) Scoring & Rules

Default: +1 for each correctly answered question; each run covers 24 questions unless the configurable `questionCount` is changed.

**Question type semantics:**

- **`single`** — radio group (one selection). The `correct` array can hold one or more values; the user is correct if their single pick matches _any_ of them (e.g. Q011 accepts both “1.30pm” and “Lord only knows”).
- **`multiple`** — checkbox group. Correct only when the selected set equals `correct` exactly. A `must_include` special rule can require specific options regardless of the rest (e.g. Q019 umbrella).
- **`rank`** — ordered list (drag-and-drop or up/down buttons for accessibility). Full credit only if the order matches `correct` exactly.
- **`text`** — short text input. Normalise (trim, lower-case) then compare against `acceptableAnswers`; an optional `fuzzyThreshold` allows minor typos via Levenshtein.

**Structured special rules** (typed discriminated union in `specialRules`):

- `must_include` — listed option IDs must all appear in the response.
- `fail_on_hint` — clicking the named hint forces the question to fail (e.g. Q007 cuppa hint).
- `auto_pass` — always credit the answer (escape hatch).
- `note` — documentation only; does not affect scoring.

Pass threshold: 75% (configurable constant).

Retake: allowed immediately; new random order/sample.

### 6) UX & Flows

Home → Start: brief blurb + CTA “TAKE THE TEST” (with Union Jack).

Quiz: one question per screen; big touch-friendly controls; persistent progress; “Review later” optional.

Submit → Results: score, pass/fail, breakdown with the witty feedback per question; persona reveal with illustrated diploma; Retake / Share / Ko-fi / Feedback CTA cluster.

Empty/error states: show graceful message if question bank fails to load. Feedback form failures surface an inline error, preserve typed content, and provide a fallback mailto link.

### 7) Information Architecture

`/` Home

`/quiz` The quiz UI (CSR)

`/results` Summary view (share-friendly static route with client state or URL token)

`/feedback` Form to submit suggestions and free-text feedback.

### 8) Accessibility & Performance

WCAG AA target. Labels for radios/checkboxes, semantic headings, skip-to-content.

Lighthouse ≥ 95 on Performance, Accessibility, Best Practices.

Render in under 1s on 4G; JS bundle < 150KB gz (target).

### 9) Security & Privacy

No PII stored in MVP. The optional feedback email field is forwarded inside the transactional email (so you can reply) and discarded immediately afterward.

Cookie-less analytics (e.g., Plausible mode without cookies).

No server-side state required; all scoring client-side.

### 10) Observability / Metrics

-- measuring how people actually use the site
DAU/MAU, quiz start rate, finish rate, avg score, share click rate.

Per-question difficulty (correct %), dwell time, rage clicks (optional), and drop-off (last question reached before exit).

### 11) Risks & Legal Notes

Parody/fair use: Prominent disclaimer that this is unofficial and humorous.

Third-party attributions: the tea-making credit note you left (confirm before publish).

### 12) Acceptance Criteria (MVP “Definition of Done”)

A user on mobile can start quiz, answer 24 mixed question types, submit, and view results with per-question feedback—all within ~60–90 seconds, with no layout jank.

Ranking and multi-select behave exactly as defined per item.

Pass/fail displayed with configurable threshold.

Share button copies a short URL that opens the site (score need not be encoded in MVP).

Success screen shows persona comparison with illustrated diploma and offers share + download options.

Ko-fi support link is visible on success screen and home page footer.

Feedback form reachable from success screen and home footer; submissions send to configured inbox and confirm without data loss.

Lighthouse scores meet targets; keyboard navigation is complete across quiz, results, and feedback form.

### 13) Implementation Notes (Key Behaviours)

Question rendering switches by type.

Ranking uses up/down buttons for keyboard-first accessibility (drag-and-drop is a future enhancement).

“Must include umbrella” modelled via `specialRules: [{ kind: "must_include", optionIds: [4] }]`.

Train arrival (Q011) uses the `single` type with multiple acceptable values in `correct` — selecting either “1.30pm” or “Lord only knows” counts as correct.

Per-choice feedback: render after submission on Results page (not during test), using the bank’s feedback and the general feedbackCorrect/Incorrect.

Persona selection: configurable map of score brackets → persona metadata (name, blurb, asset paths) rendered in diploma card component.

Feedback submissions call a serverless route that validates content, applies spam protection (honeypot + rate limit), and forwards the payload to `feedback@unofficiallifeintheuk.com` via transactional email (e.g., Resend or Postmark). If the user supplies their email, it is inserted into the forwarded message body and discarded immediately afterward; otherwise the message is marked anonymous, so no PII is stored beyond the outbound email.

Analytics capture `question_exit` events (last question visited when a session ends early) so content/design can identify weak questions.
