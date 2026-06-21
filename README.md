# Nihongo Sensei

A free, installable Japanese learning PWA — chat, kana/kanji study, JLPT practice tests, and 5 visual vibes.

Powered by **Google Gemini's free tier** (gemini-2.5-flash) — no API billing required to get started.

## Deploy it for free (no terminal needed)

### 1. Get a free Gemini API key
Go to https://aistudio.google.com/apikey → Create API key. No credit card required.
(Note: Google's free tier has daily/per-minute request limits that change periodically — fine for personal use and small-scale sharing, but check current limits at https://ai.google.dev/gemini-api/docs/pricing if you plan on heavier traffic.)

### 2. Put this project on GitHub
1. Create a free account at https://github.com if you don't have one.
2. Click **New repository** → name it `nihongo-sensei` → Create.
3. Click **uploading an existing file** → drag this entire folder's contents in → Commit.

### 3. Deploy on Vercel
1. Create a free account at https://vercel.com (sign in with GitHub — easiest).
2. Click **Add New → Project** → select your `nihongo-sensei` repo → Import.
3. Vercel auto-detects Vite. Before clicking Deploy, open **Environment Variables** and add:
   - Key: `GEMINI_API_KEY`
   - Value: *(paste your key from step 1)*
4. Click **Deploy**. Wait ~1 minute.
5. You'll get a live URL like `nihongo-sensei.vercel.app` 🎉

### 4. Install it like an app
Open your live URL on your phone:
- **iPhone (Safari):** tap Share → "Add to Home Screen"
- **Android (Chrome):** tap ⋮ menu → "Install app" / "Add to Home Screen"

It'll now launch full-screen with its own icon, just like a native app.

## Updating later
Any time you want to change something, edit the file on GitHub (or re-upload it) — Vercel automatically redeploys within ~30 seconds.

## Switching AI providers later
All AI calls go through one file: `api/chat.js`. To switch back to Claude (or any other provider), that's the only file you need to touch — the frontend always expects the same `{ content: [{ type: "text", text }] }` shape back, regardless of which provider is behind it.

## Cost
- GitHub: free
- Vercel: free (Hobby tier covers this easily)
- Gemini API: free tier (rate-limited; upgrade to a paid Gemini key later if you outgrow it)
