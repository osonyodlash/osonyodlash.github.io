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

## Schreiben (exam bot) — `telc/sw.js`
Added 20.11.2026. telc B2 «Schriftlicher Ausdruck»: a random Beschwerde topic, the student writes the letter (typing or paste), AI corrects and grades it (3 criteria A–D ×3 = max 45; criterion I = D → 0).
- Flow: Gesamte = Lesen → Hören → **Schreiben** → Sprechen; Nur schriftlich = Lesen → Hören → **Schreiben** → result; new mode «4) Nur Schreiben». 60 minutes (auto-submit), student can skip (0/45).
- Scoring (teacher's decision 20.11.2026): Schreiben is part of Schriftlich — Lesen 75 + Hören 75 + Schreiben 45 = **195, pass mark stays 135**. The certificate shows a «Schriftlicher Ausdruck x / 45» row. If an exam has no Schreiben row (section closed / ended before), the old 150 scoring applies.
- Because of that, `sw.js` holds back the Lesen/Hören submit until Schreiben is done; the `imtihon` function then looks up `schreiben_results` (tg_id + exam id = the page's `S.id`) and adds it (`/submit`, `submitMund`, certificate). `exam_results.schreiben` stores the Schreiben points (`total` includes them).
- The `imtihon` function now loads its FINX («⏹ Yakunlash») and LIVE patch code from `telc/xp_finx.txt` and `telc/xp_live.txt` (previously the modules finx.ts / live.ts). Don't delete those files.
- `telc/sw_topics.json` — the 35 topics (from the teacher's PDF, typos fixed). Used by both the page and the server.
- `telc/exam.html` loads `sw.js` only if `schreiben/result` answers OK: the teacher (EXAM_TEACHER_ID) always; everyone else only when `bot_state.schreiben_open = '1'` (opened for students 21.11.2026 18:10 by a one-shot pg_cron job; a red «Schreiben qismi test rejimida ishlayapti!» banner shows on the start page until 22.11.2026 18:10, set in `telc/exam.html`). Open for students: `update bot_state set value = '1' where key = 'schreiben_open';`
- Server: Supabase `yhljeyxcporqienvdjax`, function `schreiben` (`/check`, `/result`, `/devcheck`), table `schreiben_results` (one row per student + exam id). Same Gemini keys/model as Sprechen. Limit 12 letters per student per day.

## Blocking and access reports
- `blocked_users` table (project `yhljeyxcporqienvdjax`): a blocked Telegram ID can't open either bot (checked in the SQL function `device_check`). Add: `insert into blocked_users (tg_id, note) values (<ID>, '...')`.
- "Texnik ishlar" block, both bots: `main_maint` table (same project). The `qurilma` function answers `err: "maint"` for these IDs (both @Shogirtlarim_uchun_bot and @Timur_B2simulyatsiya_bot), and `telc/index.html` / `telc/exam.html` show "🛠 Texnik ishlar ketayotgani sababli vaqtinchalik kirib bo‘lmaydi." Add: `insert into main_maint (tg_id, note) values (<ID>, '...')`; remove: `delete from main_maint where tg_id = <ID>`.
- Refused attempts (not in group / other device / blocked) are logged by `telc/index.html` and `telc/exam.html` to `hisobot/attempt` → table `access_attempts`. Reports (cron_secret): `hisobot/attempts`, `hisobot/nonmembers`.

## 21.11.2026 changes
- Schreiben: copy-paste is now FORBIDDEN in the letter box (`telc/sw.js`): paste/drop/copy/cut/context menu are blocked, and any single input that adds 30+ characters is reverted. `exam.html` loads `sw.js?v=3`.
- Sprechen (exam bot, `telc/ai.js`): when the whole oral exam ends, results go to the server as before (`EX.onDone`), then an «AI tahlili» overlay opens automatically if Mündlich < 45/75 or any Teil < 15/25 — per Teil: why this score (Uzbek summary), errors with corrections, tips, useful phrases, strengths. Everyone else gets a «📋 Sprechen tahlili» button.

## 23.11.2026 changes
- Public simulator buyers (@telcB2_imtihon_bot tariffs via @timur_lehrer_bot) are listed in `exam_quiet` (filled by trigger `lb_quiet_on_pay` on `lb_payments`; removed if the person buys a course package). The `imtihon` function (`isQuiet`) does NOT send their results to the teacher; results are still saved (`exam_results`, `mund_results`) and the student still gets their own result/certificate. Their Lesen 1 results are not added to the teacher's daily Lesen ranking. Re-enable for one person: `delete from exam_quiet where tg_id = <ID>;`
- `zentrale/index.html` (Agent markaz): status colours — green = working, yellow = waiting for approval / important, red = sleeping. New agent «Kuzatuvchi» (table `sim_visitors`, daily report `sim_daily_report()` via pg_cron `sim-kunlik-2100`).

## 23.11.2026 — bot roles
- @timur_lehrer_bot (function `lehrer`) is ONLY for payments: packages, receipts (✅/❌), access, student reminders.
- Every agent message to the teacher goes to @Agent_ofis_bot (token `zentrale_bot_token`): Reels/Stories previews (✅/❌/✏️), "muddati tugadi" (x/e/k buttons), Mini App report, material requests, Instagram posts/reports, failures. `lehrer` sends them with `ztg`; `zentrale` forwards those callbacks and the teacher's agent messages (caption edit, files, /tayyor) to `lehrer/zbot`. The zentrale webhook allows `message` + `callback_query`. Scheduled tasks use `zentrale_bot_token`, never `lehrer_bot_token`.

## 23.11.2026 — «★ Nur Hören» (until 24.11.2026 00:00)
- Members of the lesson groups «noyabr 17:00» and «noyabr 20:00» get a Hören-only exam in @Timur_B2simulyatsiya_bot: Teil 1 + 2 + 3, random tickets each attempt, 20 min, 75 points (shown threshold 45). Unlimited attempts until 00:00; every result goes to the teacher and to the student as a text message (not saved to `exam_results`; `exam_done.kind = 'HX'`).
- `imtihon` function: `hxPage()` adds mode `H` to the exam page; scope `HX` = not in the main group → only this mode; main-group members who are also in these groups get it as an extra mode. `HX_UNTIL` closes it automatically.
- Groups: table `horen_groups` (until = 24.11 00:00). Filled by `/ulash` in the group (@timur_lehrer_bot; BEFORE INSERT trigger `lb_groups_horen` diverts «noyabr 17:00/20:00» away from `lb_groups`) or by the exam bot's webhook (`seen_chats` → trigger `seen_chats_horen`). Membership is checked with the @timur_lehrer_bot token (fallback: exam bot token).
- Individual IDs can be added to `horen_groups` with `chat_id = <tg_id>`: the bot's getChatMember on that private chat returns only that user, so it opens Nur Hören for that one person. Added 23.11 for 6 IDs (the group `/ulash` route did not register).

## 25.11.2026 — «📖 Lesen Teil 3» bir martalik (scope `L3`)
- `imtihon` function: new scope `L3` (`l3Page`, same engine as `L2`): main Lesen 3 tickets 1–39 shuffled (no 1a/3b variants), 10 letters per ticket (A–L or X; no l→i conversion), result `kind = "lesen3"` → image to teacher and student, then access closes. `exam_access_scope_check` now allows `L3`.
- Give: `insert into exam_access (tg_id, scope, once, expires_at) values (<ID>, 'L3', true, now() + interval '7 days');` (if the ID already has a row: `update exam_access set scope='L3', once=true, started_at=null, used_at=null, expires_at=now()+interval '7 days' where tg_id=<ID>;`)

## 26.11.2026 — 🇩🇪 telc B1 Sprechen (AI) — faqat ruxsat berilgan ID lar
- Exam bot, «Nur mündlich»: `telc/ai.js` checks `B1_IDS` (now `5596845456`); for those IDs it loads `telc/ai_b1.js` instead of the B2 Sprechen. Everyone else is unchanged.
- `ai_b1.js`: telc Deutsch B1 format — Teil 1 Einander kennenlernen (15), Teil 2 Über ein Thema sprechen (30, 53 topics from the teacher's PDF «B1 Sprechen 2.teil», text A = student, text B = AI partner), Teil 3 Gemeinsam etwas planen (30, 55 tasks from «Sprechen B1 Teil 3 – TELC mit FARRUX»). Total 75, pass 45. AI scores 5 criteria × 0–5 per Teil (=25), converted ×15/25 and ×30/25.
- Server: Supabase function `sprechen_b1` (`/turn`, `/eval`, `/tts`, `/done`), only for IDs in `bot_state.sprechen_b1_users` (+ teacher). `/done` sends the B1 result to the teacher and the student in Telegram (logged in `ai_turns` with `bot = 'exam_b1'`).
- The student also needs: `exam_access` scope `M` (opens «Nur mündlich» only) and a row in `exam_quiet` (so the `imtihon` function does not send its B2-format Mündlich message).
- Add a student: add the ID to `B1_IDS` in `telc/ai.js` AND `update bot_state set value = value || ', <ID>' where key = 'sprechen_b1_users';` AND `insert into exam_access (tg_id, scope, expires_at) values (<ID>, 'M', now() + interval '30 days');` AND `insert into exam_quiet (tg_id, note) values (<ID>, 'B1 Sprechen');`
- Daily limit (26.11.2026): `sprechen_b1` allows each student 5 full B1 exams per day (each Teil can be started 5 times per Samarkand day; turns/evals/TTS capped accordingly, teacher unlimited). Change: `update bot_state set value = '<N>' where key = 'sprechen_b1_daylimit';`
