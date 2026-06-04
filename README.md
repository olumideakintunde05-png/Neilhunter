# NeilHunter — HTML/CSS/JS Version

Lead generation tool for web designers. Find businesses that need a website using Google Maps.

## File Structure

```
neilhunter/
├── index.html        ← Landing page
├── login.html        ← Sign in
├── signup.html       ← Create account
├── dashboard.html    ← Main search + results
├── analytics.html    ← Search history & usage
├── pricing.html      ← Plans (works logged in & out)
├── style.css         ← All styles
├── auth.js           ← Session management (localStorage)
├── scoring.js        ← Lead scoring algorithm
├── sidebar.js        ← Sidebar collapse/mobile/logout
└── toast.js          ← Toast notifications
```

## How to Run

Open `index.html` in any browser. No build step needed.
For local development with a server: `npx serve .` or `python3 -m http.server 8080`

## Add API Keys

In `dashboard.html`, find these two lines and insert your keys:

```js
const GOOGLE_KEY = '';   // Google Maps Places API key
const OPENAI_KEY = '';   // OpenAI API key (for AI analysis)
```

Without keys, the app runs in **demo mode** with realistic mock data.

## Features

- ✅ Sign up / Sign in (localStorage auth)
- ✅ Sidebar with collapse, mobile hamburger, logout
- ✅ Google Maps Places API search (or mock data)
- ✅ Lead scoring 1–100
- ✅ Website detection (None / Outdated / Modern)
- ✅ Filter & sort results
- ✅ AI analysis + outreach messages (GPT-4, Starter/Pro only)
- ✅ CSV & Excel export
- ✅ Search history in Analytics
- ✅ Daily search limits by plan
- ✅ Dark / light theme
- ✅ Stripe upgrade flow (demo mode or real links)

## Plans

| Plan    | Searches/day | AI Analysis | Excel Export | Price  |
|---------|-------------|-------------|--------------|--------|
| FREE    | 10          | ✕           | ✕            | Free   |
| STARTER | 200         | ✓           | ✓            | $15/mo |
| PRO     | Unlimited   | ✓           | ✓            | $39/mo |

## Stripe Setup

In `pricing.html`, replace the Stripe links:

```js
const STRIPE = {
  STARTER: 'https://buy.stripe.com/YOUR_STARTER_LINK',
  PRO:     'https://buy.stripe.com/YOUR_PRO_LINK',
};
```

Until replaced, clicking upgrade triggers a demo simulation.
