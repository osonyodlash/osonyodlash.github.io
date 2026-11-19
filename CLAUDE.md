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

## Phone app (PWA) — `telc/ilova.html`
Students install https://osonyodlash.github.io/telc/ilova.html to the home screen (Safari → Share → Add to Home Screen). It opens the same `app.bin` without Telegram, but each phone works only after the teacher approves it.
- `telc/ilova.html` — loader; `telc/ilova.webmanifest`, `telc/ic/*` — icon/manifest.
- Server: Supabase project `yhljeyxcporqienvdjax`, Edge Function `ilova` (`/req`, `/status`, `/open`, `/ping`, `/webhook`, `/setup`), table `app_dev`.
- Each phone makes a non-extractable ECDSA key; every request is signed. Copying the app to another phone doesn't work — a new phone means a new request.
- Approval: student sends `/start app_CODE` to @Timur_B2simulyatsiya_bot → teacher gets ✅/❌ buttons. Approving a new phone closes the student's previous one. The exam bot's webhook points to `ilova/webhook`; everything except these app updates is forwarded unchanged to `imtihon/webhook`. To undo: `ilova/setup` with `what: "restore"`.
- Revoke by hand: `update app_dev set status = 'old' where tg_id = <ID> and status = 'ok';`

## Live "who is online" — `telc/live.js`
A small 👥 button (bottom left) shows who is studying right now and in which section. It is loaded by `telc/index.html` (mode `tg`), `telc/ilova.html` (mode `app`) and `telc/exam.html` (mode `exam`, replaces the exam page's own 👥 button and also shows the current Teil).
- Server: Supabase `yhljeyxcporqienvdjax`, function `ilova`: `/livetg`, `/live`, `/examlive`. Tables `main_live` (platform) and `exam_live` (+ column `teil`); SQL functions `main_live_ping`, `exam_live_ping2`. The teacher is never listed.

## Blocking and access reports
- `blocked_users` table (project `yhljeyxcporqienvdjax`): a blocked Telegram ID can't open either bot (checked in the SQL function `device_check`). Add: `insert into blocked_users (tg_id, note) values (<ID>, '...')`.
- "Texnik ishlar" block, main bot only: `main_maint` table (same project). The `qurilma` function answers `err: "maint"` for these IDs when the request comes from @Shogirtlarim_uchun_bot, and `telc/index.html` shows "🛠 Texnik ishlar ketayotgani sababli vaqtinchalik kirib bo‘lmaydi." The exam bot is not affected. Add: `insert into main_maint (tg_id, note) values (<ID>, '...')`; remove: `delete from main_maint where tg_id = <ID>`.
- Refused attempts (not in group / other device / blocked) are logged by `telc/index.html` and `telc/exam.html` to `hisobot/attempt` → table `access_attempts`. Reports (cron_secret): `hisobot/attempts`, `hisobot/nonmembers`.
