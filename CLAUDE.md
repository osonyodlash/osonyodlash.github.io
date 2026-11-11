# telc B2 site — instructions for Claude

The telc B2 prep site is at `telc/`. Students open it ONLY through the Telegram bot @Shogirtlarim_uchun_bot (Mini App).

## Files
- `telc/index.html` — loader. It checks the Telegram login, then receives the real site from the server. **Do not put the real site here.**
- `telc/app.bin` — the real site (all content and answers), AES-GCM encrypted. The plaintext lives only locally as `telc/app.html` (in .gitignore, never commit it).
- `telc/admin.html` — admin panel (opened in the bot with /panel).
- `telc/*.js`, `telc/h`, `l1`, … — images. They are public, which is fine.
- `tools/pack.mjs` — encrypt/decrypt.
- `telc/me.bin` — Behzod's personal copy (separate key). **Do not touch, change or delete it.**

## Changing the site
The key (`TELC_KEY`) is not in this repo. Ask the admin for it and never write it into a file.

```bash
export TELC_KEY=...                  # key from the admin
node tools/pack.mjs unpack           # app.bin -> telc/app.html
# ... edit telc/app.html (one big HTML file: data constants + JS) ...
node tools/pack.mjs pack             # telc/app.html -> app.bin
git add telc/app.bin && git commit -m "..." && git push
```
Changes reach students within about 2–10 minutes (GitHub Pages + server cache). Students then reopen the bot.

## Server
Supabase project `telc-b2` (ref `hveicvjjqiehjxkwqobr`). Its Edge Function `tg`:
- `/webhook` — the bot (/start, /admin CODE, /panel; connects a group automatically when an admin adds the bot to it);
- `/open` — initData check + group membership check, then returns the HTML;
- `/ping` — time tracking, one session per user;
- `/admin` — data for the panel.

Tables: `users`, `visits`, `groups`, `denied`.
