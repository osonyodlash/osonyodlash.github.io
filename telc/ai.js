/* Sprechen AI — telc B2 mündliche Prüfung bilan ovozli mashq (Gemini).
   app.html ichidan: AISprech.mount(el, {t2: MUND, t3: MT3}) */
(function () {
  var FN = "https://yhljeyxcporqienvdjax.supabase.co/functions/v1/sprechen";
  var MAXSEC = { 1: 210, 2: 120, 3: 120 };
  // telc B2 mündliche Prüfung – Teil 1: 7 rasmiy mavzu. Har biri: [nemischa, o'zbekcha, kichik punktlar (nemischa), o'zbekcha izoh]
  var T1 = [
    ["Reise", "Sayohat", "Ziel, Zeit, Land und Leute, Sehenswürdigkeiten", "Manzil, vaqt, mamlakat va odamlar, diqqatga sazovor joylar"],
    ["Buch", "Kitob", "Thema, Autor, Meinung", "Mavzu, muallif, fikringiz"],
    ["Film", "Film", "Thema, Handlung, Schauspieler, Meinung", "Mavzu, syujet, aktyorlar, fikringiz"],
    ["Sportereignis", "Sport voqeasi", "Sportart, Ort, Personen, Ergebnis", "Sport turi, joy, ishtirokchilar, natija"],
    ["Musikveranstaltung", "Musiqa tadbiri", "Musikrichtung, Musiker, Ort", "Musiqa yo'nalishi, musiqachi, joy"],
    ["Wichtige Person im Leben", "Hayotdagi muhim inson", "wer, wann, warum wichtig", "kim, qachon, nega muhim"],
    ["Wichtige Erfahrung", "Muhim tajriba", "was, wann, wo, mit wem, warum wichtig", "nima, qachon, qayerda, kim bilan, nega muhim"]
  ];
  var TN = { 1: "Teil 1 · Präsentation", 2: "Teil 2 · Diskussion", 3: "Teil 3 · Gemeinsam planen" };
  var CR = [["aufgabe", "Topshiriqni bajarish"], ["fluss", "Ravonlik"], ["korrekt", "Grammatika"], ["wortschatz", "So'z boyligi"], ["aussprache", "Talaffuz"]];

  var CSS =
    ".ai{max-width:560px;margin:0 auto;padding:4px 2px 30px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1b2333}" +
    ".ai-card{background:#fff;border-radius:16px;padding:16px;box-shadow:0 4px 16px rgba(30,42,68,.08);margin-bottom:12px}" +
    ".ai-card h3{margin:0 0 6px;font-size:17px}.ai-card p{margin:6px 0;color:#5b6577;font-size:14px;line-height:1.45}" +
    ".ai-tabs{display:flex;gap:6px;margin-bottom:12px}.ai-tabs button{flex:1;border:2px solid #e3d3ea;background:#fff;border-radius:12px;padding:10px 4px;font-weight:700;font-size:13px;color:#7a2a5a;cursor:pointer}" +
    ".ai-tabs button.on{background:#db2777;border-color:#db2777;color:#fff}" +
    ".ai-q{width:100%;box-sizing:border-box;border:2px solid #dde3ef;border-radius:12px;padding:11px 12px;font-size:15px;margin-bottom:10px;background:#fff;color:#1b2333}" +
    ".ai-it{display:block;width:100%;text-align:left;border:0;border-bottom:1px solid #eef1f6;background:none;padding:11px 4px;font-size:15px;cursor:pointer;color:#1b2333}" +
    ".ai-it small{display:block;color:#8a93a6;font-size:12.5px;margin-top:2px}.ai-it:last-child{border-bottom:0}" +
    ".ai-btn{display:block;width:100%;margin-top:10px;background:#db2777;color:#fff;border:0;border-radius:12px;padding:14px;font-size:16px;font-weight:700;cursor:pointer}" +
    ".ai-btn.alt{background:#fbe7f1;color:#b0185f}.ai-btn:disabled{opacity:.5}" +
    ".ai-top{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;font-size:13px;color:#5b6577}" +
    ".ai-top b{color:#1b2333;font-size:14px}.ai-x{border:0;background:#eef2fb;color:#3b4a6b;border-radius:10px;padding:7px 10px;font-weight:700;cursor:pointer}" +
    ".ai-task{font-size:14px;line-height:1.45;color:#3b4a6b}.ai-task details{margin-top:6px}.ai-task summary{cursor:pointer;color:#b0185f;font-weight:700}" +
    ".ai-task .tx{white-space:pre-wrap;max-height:260px;overflow:auto;background:#f7f8fc;border-radius:10px;padding:10px;margin-top:6px;font-size:13.5px}" +
    ".ai-chat{display:flex;flex-direction:column;gap:10px;margin:12px 0 150px}" +
    ".ai-m{max-width:86%;padding:11px 13px;border-radius:16px;font-size:15.5px;line-height:1.45;word-break:break-word;position:relative}" +
    ".ai-m.ai{align-self:flex-start;background:#fff;box-shadow:0 2px 10px rgba(30,42,68,.08);border-bottom-left-radius:4px}" +
    ".ai-m.me{align-self:flex-end;background:#db2777;color:#fff;border-bottom-right-radius:4px}" +
    ".ai-m .who{display:block;font-size:11.5px;opacity:.65;margin-bottom:3px;font-weight:700}" +
    ".ai-m .pl{border:0;background:#fbe7f1;color:#b0185f;border-radius:20px;padding:4px 10px;font-size:13px;font-weight:700;margin-top:7px;cursor:pointer}" +
    ".ai-m.wait{opacity:.7;font-style:italic}" +
    ".ai-bar{position:fixed;left:0;right:0;bottom:0;background:rgba(244,246,251,.97);backdrop-filter:blur(6px);padding:10px 14px calc(12px + env(safe-area-inset-bottom));box-shadow:0 -4px 16px rgba(30,42,68,.08);z-index:50}" +
    ".ai-bar .in{max-width:560px;margin:0 auto;display:flex;align-items:center;gap:10px}" +
    ".ai-mic{flex:1;border:0;border-radius:16px;padding:16px 10px;font-size:17px;font-weight:800;background:#db2777;color:#fff;cursor:pointer;-webkit-tap-highlight-color:transparent}" +
    ".ai-mic.rec{background:#e0453a;animation:aiP 1.2s infinite}.ai-mic:disabled{background:#c9cfdc}" +
    "@keyframes aiP{50%{box-shadow:0 0 0 8px rgba(224,69,58,.18)}}" +
    ".ai-sm{border:0;background:#fff;border-radius:14px;padding:14px 13px;font-size:18px;box-shadow:0 2px 8px rgba(30,42,68,.1);cursor:pointer}" +
    ".ai-txt{display:flex;gap:8px;max-width:560px;margin:8px auto 0}.ai-txt textarea{flex:1;border:2px solid #dde3ef;border-radius:12px;padding:9px;font-size:15px;resize:none;font-family:inherit}" +
    ".ai-txt button{border:0;background:#db2777;color:#fff;border-radius:12px;padding:0 14px;font-weight:800;font-size:15px}" +
    ".ai-fin{max-width:560px;margin:6px auto 0;display:block;width:100%;border:0;background:none;color:#b0185f;font-weight:700;font-size:13.5px;padding:4px;cursor:pointer}" +
    ".ai-sc{display:flex;align-items:center;gap:8px;margin:7px 0;font-size:14px}.ai-sc span{width:130px}.ai-sc i{flex:1;height:9px;background:#eef1f6;border-radius:9px;overflow:hidden}" +
    ".ai-sc i b{display:block;height:100%;background:#db2777;border-radius:9px}.ai-sc em{font-style:normal;font-weight:800;width:34px;text-align:right}" +
    ".ai-big{text-align:center}.ai-big .n{font-size:42px;font-weight:900;color:#db2777;line-height:1.1}.ai-big .lv{display:inline-block;margin-top:6px;background:#fbe7f1;color:#b0185f;font-weight:800;border-radius:20px;padding:4px 12px}" +
    ".ai-l{margin:6px 0 0;padding-left:18px;font-size:14.5px;line-height:1.5}.ai-l li{margin:4px 0}" +
    ".ai-fx{border-top:1px solid #eef1f6;padding:9px 0;font-size:14.5px;line-height:1.45}.ai-fx .w{color:#b3261e;text-decoration:line-through}.ai-fx .r{color:#127a3e;font-weight:700}.ai-fx .y{color:#5b6577;font-size:13.5px}" +
    ".ai-err{background:#fdecec;color:#b3261e;border-radius:12px;padding:10px 12px;font-size:14px;margin:8px 0}";

  function css() { if (document.getElementById("ai-css")) return; var s = document.createElement("style"); s.id = "ai-css"; s.textContent = CSS; document.head.appendChild(s); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var INIT = "";
  function initData() { if (INIT) return INIT; try { return (window.Telegram && Telegram.WebApp && Telegram.WebApp.initData) || ""; } catch (e) { return ""; } }
  function hap(t) { try { Telegram.WebApp.HapticFeedback.impactOccurred(t || "light"); } catch (e) {} }
  function mmss(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function errText(e, msg) {
    if (msg && (e === "limit" || e === "nosession")) return msg; // server yuborgan aniq limit xabari
    return { auth: "Kirish tasdiqlanmadi. Botdan saytni qayta oching.", nokey: "AI hali ulanmagan. Ustoz sozlashi kerak.", cap: "Bugungi limit tugadi. Ertaga davom eting.", limit: "Bugungi limit tugadi. Ertaga davom eting.", nosession: "Suhbat topilmadi. Mavzuni qaytadan tanlab boshlang.", big: "Yozuv juda uzun. Qisqaroq gapiring.", net: "Internet aloqasini tekshiring." }[e] || "AI hozir band (Google serverlari). Bir necha soniyadan keyin «Qayta yuborish»ni bosing.";
  }

  // AI band bo'lsa (Google serveri) bir marta avtomatik qayta urinadi
  function post(path, meta, blob) {
    return post1(path, meta, blob).catch(function (e) {
      if (e.message !== "ai") throw e;
      return new Promise(function (r) { setTimeout(r, 2500); }).then(function () { return post1(path, meta, blob); });
    });
  }
  function post1(path, meta, blob) {
    meta.initData = initData();
    var opt = { method: "POST" };
    if (blob) { var fd = new FormData(); fd.append("meta", JSON.stringify(meta)); fd.append("audio", blob, "a.wav"); opt.body = fd; }
    else { opt.headers = { "content-type": "application/json" }; opt.body = JSON.stringify(meta); }
    return fetch(FN + path, opt).then(function (r) {
      if (path === "/tts" && r.ok) return r.blob();
      return r.json().then(function (j) { if (!j.ok) { var er = new Error(j.err || "ai"); er.msg = j.msg; throw er; } return j; }, function () { throw new Error("ai"); });
    }, function () { throw new Error("net"); });
  }

  // ---- Ovoz yozish: 16 kHz mono WAV
  var Rec = {
    ctx: null, stream: null, node: null, src: null, bufs: [], rate: 16000, on: false,
    start: function () {
      var self = this;
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error("nomic"));
      return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } }).then(function (st) {
        var AC = window.AudioContext || window.webkitAudioContext;
        self.ctx = self.ctx || new AC();
        if (self.ctx.state === "suspended") self.ctx.resume();
        self.stream = st; self.bufs = []; self.on = true;
        self.src = self.ctx.createMediaStreamSource(st);
        self.node = self.ctx.createScriptProcessor(4096, 1, 1);
        self.node.onaudioprocess = function (e) { if (self.on) self.bufs.push(new Float32Array(e.inputBuffer.getChannelData(0))); };
        self.src.connect(self.node); self.node.connect(self.ctx.destination);
      });
    },
    stop: function () {
      this.on = false;
      try { this.src.disconnect(); this.node.disconnect(); } catch (e) {}
      try { this.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
      var inRate = this.ctx ? this.ctx.sampleRate : 48000, n = 0, i, j;
      for (i = 0; i < this.bufs.length; i++) n += this.bufs[i].length;
      var all = new Float32Array(n), o = 0;
      for (i = 0; i < this.bufs.length; i++) { all.set(this.bufs[i], o); o += this.bufs[i].length; }
      this.bufs = [];
      var ratio = inRate / this.rate, len = Math.floor(n / ratio), pcm = new Int16Array(len);
      for (i = 0; i < len; i++) {
        var a = Math.floor(i * ratio), b = Math.min(n, Math.floor((i + 1) * ratio)), s = 0, c = 0;
        for (j = a; j < b; j++) { s += all[j]; c++; }
        var v = c ? s / c : 0; v = Math.max(-1, Math.min(1, v)); pcm[i] = v < 0 ? v * 0x8000 : v * 0x7fff;
      }
      var buf = new ArrayBuffer(44 + pcm.length * 2), d = new DataView(buf), r = this.rate;
      var w = function (p, s) { for (var k = 0; k < s.length; k++) d.setUint8(p + k, s.charCodeAt(k)); };
      w(0, "RIFF"); d.setUint32(4, 36 + pcm.length * 2, true); w(8, "WAVE"); w(12, "fmt "); d.setUint32(16, 16, true); d.setUint16(20, 1, true); d.setUint16(22, 1, true);
      d.setUint32(24, r, true); d.setUint32(28, r * 2, true); d.setUint16(32, 2, true); d.setUint16(34, 16, true); w(36, "data"); d.setUint32(40, pcm.length * 2, true);
      new Int16Array(buf, 44).set(pcm);
      return { blob: new Blob([buf], { type: "audio/wav" }), sec: len / r };
    }
  };

  // ---- Ovoz chiqarish (iOS uchun bitta "ochilgan" audio element)
  var player = null, curUrl = null;
  function unlock() {
    if (!player) { player = new Audio(); player.setAttribute("playsinline", ""); }
    try { player.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="; var p = player.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }
  function stopPlay() { try { player && player.pause(); } catch (e) {} try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} }
  function speakFallback(text) {
    try {
      if (!window.speechSynthesis) return;
      var u = new SpeechSynthesisUtterance(text); u.lang = "de-DE"; u.rate = 0.95;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^de/i.test(x.lang); })[0]; if (v) u.voice = v;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) {}
  }
  var ttsCache = {};
  function say(text, btn) {
    stopPlay();
    if (btn) btn.textContent = "⏳ Ovoz…";
    var done = function () { if (btn) btn.textContent = "🔊 Qayta eshitish"; };
    var play = function (blob) {
      if (!player) unlock();
      if (curUrl && !ttsCache[text]) URL.revokeObjectURL(curUrl);
      curUrl = URL.createObjectURL(blob); ttsCache[text] = curUrl;
      player.src = curUrl; var p = player.play(); done();
      if (p && p.catch) p.catch(function () { speakFallback(text); });
    };
    if (ttsCache[text]) { player.src = ttsCache[text]; var p0 = player.play(); if (p0 && p0.catch) p0.catch(function () {}); done(); return; }
    post("/tts", { text: text, voice: "Charon" }).then(play, function () { done(); speakFallback(text); });
  }

  function mount(el, data) {
    css();
    data = data || {};
    var T2 = (data.t2 || []).map(function (m) { return { title: m.t, uz: m.u, head: m.ot || m.t, text: m.od || "", textUz: m.ou || "" }; });
    var T3 = (data.t3 || []).map(function (x) { return { title: x[1], uz: x[2], task: x[3], taskUz: x[4], points: (x[5] || []).map(function (p) { return p[0]; }).join(" / ") }; });
    var teil = +(localStorage.getItem("ai_teil") || 2) || 2, q = "", S = null;
    // Imtihon rejimi (@Timur_B2simulyatsiya_bot): Teil 1→2→3 ketma-ket, baho oxirida
    var EX = data.exam || null, done = [];
    if (EX) { INIT = EX.initData || ""; done = (EX.done || []).slice(); teil = done.length + 1; EX.topics = EX.topics || {}; }
    el.innerHTML = '<div class="ai"></div>'; var root = el.firstChild;

    function list() {
      if (teil === 1) return T1.map(function (t) { return { title: t[0], uz: t[1], points: t[2] || "", pointsUz: t[3] || "" }; });
      return teil === 2 ? T2 : T3;
    }

    function home() {
      if (EX) return examHome();
      stopPlay(); S = null; removeBar();
      var L = list(), qq = q.trim().toLowerCase();
      var rows = L.map(function (t, i) { return [t, i]; }).filter(function (p) { return !qq || (p[0].title + " " + (p[0].uz || "")).toLowerCase().indexOf(qq) >= 0; });
      root.innerHTML =
        '<div class="ai-card"><h3>🤖 AI bilan Sprechen</h3><p>Haqiqiy imtihondagidek: mavzuni tanlang, <b>mikrofon tugmasini bosib nemischa gapiring</b>, AI imtihon oluvchi sifatida ovoz bilan javob beradi. Oxirida telc mezonlari bo\'yicha baho va xatolaringiz tahlilini olasiz.</p></div>' +
        '<div class="ai-tabs">' + [1, 2, 3].map(function (n) { return '<button data-tl="' + n + '" class="' + (teil === n ? "on" : "") + '">Teil ' + n + '<br><small style="font-weight:600">' + ["Präsentation", "Diskussion", "Planen"][n - 1] + '</small></button>'; }).join("") + '</div>' +
        '<div class="ai-card"><input class="ai-q" id="aiq" placeholder="Mavzu qidirish…" value="' + esc(q) + '" autocomplete="off">' +
        (teil === 1 ? '<button class="ai-it" data-own="1"><b>✏️ O\'z mavzuim</b><small>Imtihonda tushgan mavzuni o\'zingiz yozing</small></button>' : "") +
        rows.map(function (p) { var sub = teil === 1 ? ((p[0].uz ? p[0].uz + " · " : "") + (p[0].points || "")) : (p[0].uz || ""); return '<button class="ai-it" data-i="' + p[1] + '"><b>' + esc(p[0].title) + '</b><small>' + esc(sub) + '</small></button>'; }).join("") +
        (rows.length ? "" : '<p>Topilmadi.</p>') + '</div>';
      [].forEach.call(root.querySelectorAll("[data-tl]"), function (b) { b.onclick = function () { teil = +b.dataset.tl; q = ""; try { localStorage.setItem("ai_teil", teil); } catch (e) {} home(); }; });
      var qi = root.querySelector("#aiq"); qi.oninput = function () { q = qi.value; var pos = qi.selectionStart; home(); var n = root.querySelector("#aiq"); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} };
      [].forEach.call(root.querySelectorAll("[data-i]"), function (b) { b.onclick = function () { begin(list()[+b.dataset.i]); }; });
      var own = root.querySelector("[data-own]");
      if (own) own.onclick = function () {
        var t = prompt("Mavzuni nemischa yozing:", ""); if (!t || !t.trim()) return; begin({ title: t.trim(), uz: "" });
      };
    }

    function examHead() {
      return '<div class="ai-top"><b>Mündliche Prüfung · Teil ' + teil + ' / 3</b><span>' + ["Präsentation", "Diskussion", "Gemeinsam planen"][teil - 1] + '</span></div>';
    }
    function examHome() {
      stopPlay(); S = null; removeBar();
      if (teil > 3) return EX.onDone(done.slice());
      if (teil === 1) {
        var L1 = list();
        root.innerHTML = examHead() +
          '<div class="ai-card"><h3>🎤 Teil 1 · Präsentation</h3><p>Gapirmoqchi bo\'lgan mavzuingizni tanlang. Taxminan 2 daqiqa taqdimot qilasiz, keyin imtihon oluvchi 1 ta savol beradi.</p><p><i>Wählen Sie das Thema Ihrer Präsentation.</i></p></div>' +
          '<div class="ai-card"><button class="ai-it" data-own="1"><b>✏️ O\'z mavzuim</b><small>Boshqa mavzuni o\'zingiz yozing</small></button>' +
          L1.map(function (t, i) { return '<button class="ai-it" data-i="' + i + '"><b>' + esc(t.title) + '</b><small>' + esc((t.uz ? t.uz + " · " : "") + (t.points || "")) + '</small></button>'; }).join("") + '</div>';
        [].forEach.call(root.querySelectorAll("[data-i]"), function (b) { b.onclick = function () { begin(L1[+b.dataset.i]); }; });
        root.querySelector("[data-own]").onclick = function () { var t = prompt("Mavzuni nemischa yozing:", ""); if (!t || !t.trim()) return; begin({ title: t.trim(), uz: "" }); };
        return;
      }
      var L = teil === 2 ? T2 : T3;
      var ix = +EX.topics[teil];
      if (!(ix >= 0 && ix < L.length)) { ix = Math.floor(Math.random() * L.length); EX.topics[teil] = ix; if (EX.onTopic) EX.onTopic(teil, ix); }
      var t = L[ix];
      root.innerHTML = examHead() +
        '<div class="ai-card"><h3>🎲 Ihr Thema · Sizning mavzuingiz</h3><p style="font-size:17px;color:#1b2333"><b>' + esc(teil === 2 ? t.head : t.title) + '</b></p><p>' +
        (teil === 2 ? "Mavzu tasodifiy tanlandi. Matnni o'qiysiz, keyin imtihon oluvchi 5 ta savol beradi." : "Mavzu tasodifiy tanlandi. Imtihon oluvchi bilan birgalikda reja tuzasiz: taklif bering, fikr bildiring, vazifalarni bo'ling.") +
        '</p><button class="ai-btn" id="aigo">🎙 Boshlash</button></div>';
      root.querySelector("#aigo").onclick = function () { begin(t); };
    }
    function examNext(item) {
      done.push(item);
      if (EX.onTeil) EX.onTeil(done.slice());
      teil++; stopPlay(); removeBar(); S = null;
      if (teil > 3) return EX.onDone(done.slice());
      root.innerHTML = '<div class="ai-card" style="text-align:center"><h3>✅ Teil ' + (teil - 1) + ' tugadi</h3><p>Natijalar barcha qismlar tugagandan keyin chiqadi.</p><button class="ai-btn" id="ainx">Teil ' + teil + ' ga o\'tish ➜</button></div>';
      root.querySelector("#ainx").onclick = examHome;
      window.scrollTo(0, 0);
    }
    function examItem(ev) {
      var sc = ev.scores || {}, s = {}, tot = 0;
      CR.forEach(function (c) { var v = Math.max(0, Math.min(5, Math.round(+sc[c[0]] || 0))); s[c[0]] = v; tot += v; });
      var arr = function (a, n) { return (Array.isArray(a) ? a : []).slice(0, n).map(function (x) { return String(x).slice(0, 300); }); };
      return {
        teil: teil, title: S.topic.title, s: s, tot: tot, niveau: String(ev.niveau || "").slice(0, 20), summary: String(ev.summary || "").slice(0, 1200),
        good: arr(ev.good, 3), tips: arr(ev.tips, 3),
        fixes: (Array.isArray(ev.fixes) ? ev.fixes : []).slice(0, 8).map(function (f) { return { wrong: String(f.wrong || "").slice(0, 300), right: String(f.right || "").slice(0, 300), why: String(f.why || "").slice(0, 300) }; })
      };
    }

    function removeBar() { var b = document.getElementById("ai-bar"); if (b) b.remove(); }

    function begin(topic) {
      unlock(); hap();
      S = { topic: topic, hist: [], busy: false, ended: false, rec: false, t0: 0, tmr: null, typing: false };
      chat(); ask({ start: true });
    }

    function topicMeta() {
      var t = S.topic;
      if (teil === 1) return { title: t.title, task: t.points ? ("Der Kandidat soll diese Punkte ansprechen: " + t.points) : "", points: t.points || "" };
      return { title: t.title, task: t.task || t.head || "", text: t.text || "", points: t.points || "" };
    }

    function chat() {
      var t = S.topic;
      var task = teil === 1
        ? '<b>Thema: ' + esc(t.title) + '</b>' + (t.uz ? ' <span style="color:#8a93a6">(' + esc(t.uz) + ')</span>' : "") + (t.points ? '<br><span style="color:#5b6577">Punkte: ' + esc(t.points) + '</span>' + (t.pointsUz ? ' <span style="color:#8a93a6">(' + esc(t.pointsUz) + ')</span>' : "") : "") + '<br>Taqdimot ~2 daqiqa: kirish → asosiy qism (yuqoridagi punktlar bo\'yicha) → xulosa. Keyin Prüfer 1 ta savol beradi.'
        : EX && teil === 2
        ? '<b>' + esc(t.head) + '</b>' + (t.text ? '<div class="tx">' + esc(t.text) + '</div>' : "")
        : EX
        ? '<b>' + esc(t.title) + '</b><br>' + esc(t.task || "")
        : teil === 2
        ? '<b>' + esc(t.head) + '</b>' + (t.text || t.textUz ? '<details><summary>Matnni o\'qish</summary><div class="tx">' + esc(t.text || t.textUz) + '</div>' + (t.text && t.textUz ? '<details><summary>O\'zbekcha tarjima</summary><div class="tx">' + esc(t.textUz) + '</div></details>' : "") + '</details>' : "")
        : '<b>' + esc(t.title) + '</b><br>' + esc(t.task || "") + (t.taskUz ? '<details><summary>O\'zbekcha</summary><div class="tx">' + esc(t.taskUz) + '</div></details>' : "");
      root.innerHTML =
        '<div class="ai-top"><b>' + TN[teil] + (EX ? " · " + teil + "/3" : "") + '</b>' + (EX ? "" : '<button class="ai-x" id="aiback">✕ Chiqish</button>') + '</div>' +
        '<div class="ai-card ai-task">' + task + '</div><div class="ai-chat" id="aich"></div>';
      if (!EX) root.querySelector("#aiback").onclick = function () { if (S && S.rec) { try { Rec.stop(); } catch (e) {} } if (!S || S.hist.length < 3 || confirm("Suhbatdan chiqasizmi? Baho olinmaydi.")) home(); };
      S.hist.forEach(function (h) { bubble(h.role, h.text, true); });
      bar();
    }

    function bar() {
      removeBar();
      var b = document.createElement("div"); b.id = "ai-bar"; b.className = "ai-bar";
      b.innerHTML =
        '<div class="in"><button class="ai-sm" id="aikb" title="Yozish">⌨️</button><button class="ai-mic" id="aimic">🎙 Gapirish</button></div>' +
        '<div class="ai-txt" id="aitx" hidden><textarea id="aita" rows="2" placeholder="Nemischa yozing…"></textarea><button id="aisend">➤</button></div>' +
        '<button class="ai-fin" id="aifin">🏁 Yakunlash va baho olish</button>';
      document.body.appendChild(b);
      b.querySelector("#aimic").onclick = micTap;
      b.querySelector("#aikb").onclick = function () { S.typing = !S.typing; b.querySelector("#aitx").hidden = !S.typing; if (S.typing) b.querySelector("#aita").focus(); };
      b.querySelector("#aisend").onclick = function () { var ta = b.querySelector("#aita"), v = ta.value.trim(); if (!v || S.busy) return; ta.value = ""; bubble("me", v); S.hist.push({ role: "me", text: v }); ask({ text: v }); };
      b.querySelector("#aifin").onclick = finish;
      sync();
    }

    function sync() {
      var m = document.getElementById("aimic"); if (!m || !S) return;
      var f = document.getElementById("aifin");
      if (f) f.textContent = EX ? (S.ended ? (teil < 3 ? "➜ Keyingi qismga o'tish" : "🏁 Imtihonni yakunlash") : "🏁 Shu qismni yakunlash") : S.ended ? "🏁 Baho olish" : "🏁 Yakunlash va baho olish";
      if (S.rec) { m.className = "ai-mic rec"; m.disabled = false; m.textContent = "⏹ To'xtatish · " + mmss((Date.now() - S.t0) / 1000) + " / " + mmss(MAXSEC[teil]); return; }
      m.className = "ai-mic"; m.disabled = S.busy || S.ended;
      m.textContent = S.ended ? "✅ Suhbat tugadi" : S.busy ? "⏳ AI o'ylayapti…" : "🎙 Gapirish";
    }

    function bubble(role, text, silent) {
      var ch = root.querySelector("#aich"); if (!ch) return null;
      var d = document.createElement("div"); d.className = "ai-m " + (role === "ai" ? "ai" : role === "me" ? "me" : "ai wait");
      d.innerHTML = '<span class="who">' + (role === "ai" ? "🧑‍🏫 Prüfer" : role === "me" ? "Siz" : "") + '</span>' + esc(text) + (role === "ai" ? '<br><button class="pl">🔊 Qayta eshitish</button>' : "");
      ch.appendChild(d);
      var pl = d.querySelector(".pl"); if (pl) pl.onclick = function () { say(text, pl); };
      if (!silent) setTimeout(function () { d.scrollIntoView({ behavior: "smooth", block: "end" }); }, 30);
      return d;
    }

    function micTap() {
      if (!S || S.busy || S.ended) return;
      if (!S.rec) {
        stopPlay(); hap("medium");
        Rec.start().then(function () {
          S.rec = true; S.t0 = Date.now(); sync();
          S.tmr = setInterval(function () { if (!S || !S.rec) return; sync(); if ((Date.now() - S.t0) / 1000 >= MAXSEC[teil]) micTap(); }, 500);
        }, function () {
          var ch = root.querySelector("#aich");
          if (ch) { var e = document.createElement("div"); e.className = "ai-err"; e.innerHTML = "🎙 Mikrofonga ruxsat berilmadi. Telegram sozlamalaridan mikrofonga ruxsat bering yoki ⌨️ tugmasi orqali yozib javob bering."; ch.appendChild(e); }
          S.typing = true; var tx = document.getElementById("aitx"); if (tx) tx.hidden = false;
        });
        return;
      }
      clearInterval(S.tmr); S.rec = false; hap("medium");
      var r = Rec.stop(); sync();
      if (r.sec < 1.2) { var ch = root.querySelector("#aich"); if (ch) { var e = document.createElement("div"); e.className = "ai-err"; e.textContent = "Juda qisqa yozuv. Tugmani bosib, gapirib bo'lgach yana bosing."; ch.appendChild(e); setTimeout(function () { e.remove(); }, 4000); } return; }
      ask({ blob: r.blob, sec: r.sec });
    }

    function ask(o) {
      S.busy = true; sync();
      var mine = o.blob ? bubble("me", "🎙 " + mmss(o.sec) + " · tinglanmoqda…") : null;
      var w = bubble("wait", "Prüfer javob yozmoqda…");
      var meta = { teil: teil, topic: topicMeta(), hist: S.hist, start: !!o.start, text: o.text || "", sec: o.sec || 0 };
      var cur = S;
      post("/turn", meta, o.blob).then(function (j) {
        if (cur !== S) return;
        w && w.remove();
        if (o.blob) {
          var heard = j.heard || "(tushunarsiz)";
          if (mine) mine.innerHTML = '<span class="who">Siz · 🎙 ' + mmss(o.sec) + '</span>' + esc(heard);
          S.hist.push({ role: "me", text: heard });
        }
        if (j.reply) { S.hist.push({ role: "ai", text: j.reply }); var b = bubble("ai", j.reply); say(j.reply, b && b.querySelector(".pl")); }
        if (j.end) S.ended = true;
        S.busy = false; sync();
      }, function (e) {
        if (cur !== S) return;
        w && w.remove();
        if (mine) mine.remove();
        var ch = root.querySelector("#aich");
        if (ch) {
          var lim = e.message === "limit" || e.message === "nosession"; // limit tugagan: qayta yuborishning foydasi yo'q
          var d = document.createElement("div"); d.className = "ai-err"; d.innerHTML = "⚠️ " + esc(errText(e.message, e.msg)) + (!lim && (o.blob || o.start) ? ' <button class="ai-x" style="margin-left:6px">🔁 Qayta yuborish</button>' : "");
          ch.appendChild(d); var rb = d.querySelector("button"); if (rb) rb.onclick = function () { d.remove(); ask(o); };
          if (lim && o.start) {
            removeBar();
            if (!EX) { var hb = document.createElement("button"); hb.className = "ai-btn alt"; hb.textContent = "Mavzular"; hb.onclick = home; ch.appendChild(hb); }
          }
        }
        if (o.text) S.hist.pop();
        S.busy = false; sync();
      });
    }

    function finish() {
      if (!S || S.busy) return;
      if (S.rec) { clearInterval(S.tmr); S.rec = false; try { Rec.stop(); } catch (e) {} }
      var mineN = S.hist.filter(function (h) { return h.role === "me"; }).length;
      if (mineN < 1) {
        if (EX) {
          if (!confirm("Hali hech narsa gapirmadingiz. Bu qism 0 ball bo'ladi. Keyingisiga o'tasizmi?")) return;
          return examNext({ teil: teil, title: S.topic.title, s: { aufgabe: 0, fluss: 0, korrekt: 0, wortschatz: 0, aussprache: 0 }, tot: 0, niveau: "", summary: "Bu qismda javob berilmadi.", good: [], tips: [], fixes: [] });
        }
        if (confirm("Hali hech narsa gapirmadingiz. Chiqasizmi?")) home(); return;
      }
      stopPlay(); removeBar();
      var cur = S;
      root.innerHTML = '<div class="ai-card" style="text-align:center"><h3>⏳ AI suhbatingizni baholamoqda…</h3><p>10–20 soniya kuting.</p></div>';
      if (EX) root.innerHTML = '<div class="ai-card" style="text-align:center"><h3>⏳ Javoblaringiz saqlanmoqda…</h3><p>10–20 soniya kuting. Ilovani yopmang.</p></div>';
      post("/eval", { teil: teil, topic: topicMeta(), hist: S.hist }).then(function (j) { if (cur === S) { if (EX) examNext(examItem(j.ev || {})); else result(j.ev || {}); } }, function (e) {
        if (cur !== S) return;
        root.innerHTML = '<div class="ai-err">⚠️ ' + esc(errText(e.message, e.msg)) + '</div><button class="ai-btn" id="airt">🔁 Qayta urinish</button>' + (EX ? "" : '<button class="ai-btn alt" id="aih">Mavzular</button>');
        root.querySelector("#airt").onclick = finish; if (!EX) root.querySelector("#aih").onclick = home;
      });
    }

    function result(ev) {
      var sc = ev.scores || {}, tot = 0;
      CR.forEach(function (c) { tot += Math.max(0, Math.min(5, +sc[c[0]] || 0)); });
      var pct = Math.round(tot / 25 * 100);
      var ul = function (a) { return (a && a.length) ? '<ul class="ai-l">' + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : ""; };
      root.innerHTML =
        '<div class="ai-top"><b>' + TN[teil] + ' · ' + esc(S.topic.title) + '</b></div>' +
        '<div class="ai-card ai-big"><div>Natija</div><div class="n">' + tot + ' / 25</div><div style="color:#5b6577">' + pct + '%' + (pct >= 60 ? " — imtihon darajasiga yaqin ✅" : " — yana mashq qiling 💪") + '</div>' + (ev.niveau ? '<span class="lv">Taxminiy daraja: ' + esc(ev.niveau) + '</span>' : "") + '</div>' +
        '<div class="ai-card">' + CR.map(function (c) { var v = Math.max(0, Math.min(5, +sc[c[0]] || 0)); return '<div class="ai-sc"><span>' + c[1] + '</span><i><b style="width:' + (v * 20) + '%"></b></i><em>' + v + '/5</em></div>'; }).join("") +
        '<p style="font-size:12.5px">Talaffuz bahosi taxminiy (yozuv matni asosida).</p></div>' +
        (ev.summary ? '<div class="ai-card"><h3>📝 Umumiy xulosa</h3><p style="color:#1b2333">' + esc(ev.summary) + '</p></div>' : "") +
        (ev.good && ev.good.length ? '<div class="ai-card"><h3>👍 Yaxshi tomonlaringiz</h3>' + ul(ev.good) + '</div>' : "") +
        (ev.fixes && ev.fixes.length ? '<div class="ai-card"><h3>✏️ Xatolar va to\'g\'risi</h3>' + ev.fixes.map(function (f) { return '<div class="ai-fx"><div class="w">' + esc(f.wrong) + '</div><div class="r">✓ ' + esc(f.right) + '</div><div class="y">' + esc(f.why) + '</div></div>'; }).join("") + '</div>' : "") +
        (ev.tips && ev.tips.length ? '<div class="ai-card"><h3>🎯 Maslahatlar</h3>' + ul(ev.tips) + '</div>' : "") +
        (ev.phrases && ev.phrases.length ? '<div class="ai-card"><h3>💬 Foydali iboralar</h3>' + ul(ev.phrases) + '</div>' : "") +
        '<button class="ai-btn" id="aiag">🔁 Shu mavzuni qayta</button><button class="ai-btn alt" id="aih">Boshqa mavzu</button>';
      var t = S.topic;
      root.querySelector("#aiag").onclick = function () { begin(t); };
      root.querySelector("#aih").onclick = home;
      window.scrollTo(0, 0);
    }

    home();
  }

  function unmount() {
    try { stopPlay(); } catch (e) {}
    try { if (Rec.on) Rec.stop(); } catch (e) {}
    var b = document.getElementById("ai-bar"); if (b) b.remove();
  }

  window.AISprech = { mount: mount, unmount: unmount };
})();
