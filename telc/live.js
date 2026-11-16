/* «👥 Hozir kim shug'ullanyapti» — jonli ro'yxat (17.11.2026)
   Uch joyda ishlaydi (sahifa yuklagan joydan window.__LIVE sozlamasi bilan):
   - mode "tg"   — asosiy platforma Telegram ichida (telc/index.html): {mode, initData}
   - mode "app"  — asosiy platforma telefon ilovasida (telc/ilova.html): {mode} + window.IL (qurilma kaliti)
   - mode "exam" — imtihon boti (telc/exam.html): {mode, initData}; eski 👥 tugma yashiriladi, o'rniga shu tugma (Teil bilan)
   Server: Supabase "ilova" funksiyasi — /livetg, /live, /examlive. Ustoz ro'yxatda ko'rinmaydi. Ballar ko'rsatilmaydi. */
(function () {
  var C = window.__LIVE || {};
  if (!C.mode || window.__liveOn) return;
  window.__liveOn = 1;
  var FN = "https://yhljeyxcporqienvdjax.supabase.co/functions/v1/ilova";
  var EXAM = C.mode === "exam";
  var PH = { L: "Lesen", H: "Hören", mid: "Tanaffus", mid2: "Tanaffus", M: "Sprechen", P: "Lesen mashqi" };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] }) }
  function txt(el) { return el ? el.textContent.replace(/\s+/g, " ").trim() : "" }

  // Asosiy platforma: yon menyudagi tanlangan bo'lim (+ ichki bo'lim), bo'lmasa sarlavha
  function sectMain() {
    var g = document.querySelector("#drw .dg.on span"), d = document.querySelector("#drw .dsub.open .ds.on"), h = document.getElementById("h");
    var t = txt(g) + (d ? " · " + txt(d) : "");
    return (t || txt(h) || "Bosh sahifa").slice(0, 60);
  }
  // Imtihon: bosqich (L/H/mid/mid2/M/P) va hozir ekranda turgan Teil
  function stExam() {
    try { if (typeof L !== "undefined" && L && L.phase === "run") return "P"; } catch (e) { }
    try { if (typeof S !== "undefined" && S && PH[S.phase] && S.phase !== "P") return S.phase; } catch (e) { }
    return "";
  }
  function teilExam(st) {
    if (st === "L" || st === "H") {
      // Lesen/Hören — barcha Teil bitta sahifada: ekranning yuqori qismidagi bo'lim
      var hs = document.querySelectorAll("#app section.card .ch h2"), cur = "", lim = window.innerHeight * 0.45;
      for (var i = 0; i < hs.length; i++) { var sec = hs[i].closest("section"); if (sec && sec.getBoundingClientRect().top < lim) cur = txt(hs[i]); }
      if (!cur && hs.length) cur = txt(hs[0]);
      return cur || PH[st];
    }
    if (st === "M") {
      try { var n = ((S.mund && S.mund.done) || []).length; return "Sprechen Teil " + Math.min(3, n + 1); } catch (e) { return "Sprechen"; }
    }
    if (st === "mid") return "Tanaffus (Lesen tugadi)";
    if (st === "mid2") return "Tanaffus (Sprechen oldidan)";
    if (st === "P") {
      try { var k = L.i != null ? " · " + (L.i + 1) + "-bilet" : ""; return "Lesen mashqi" + k; } catch (e) { return "Lesen mashqi"; }
    }
    return "";
  }
  function state() {
    if (EXAM) { var st = stExam(); return { st: st, teil: teilExam(st) }; }
    return { sect: sectMain() };
  }

  async function send(list) {
    var s = state(), b;
    if (C.mode === "app") {
      var rec = window.IL && await IL.get();
      if (!rec) return null;
      return await IL.call(rec, "live", { sect: s.sect, list: !!list });
    }
    b = { initData: C.initData || "", list: !!list };
    for (var k in s) b[k] = s[k];
    var r = await fetch(FN + "/" + (EXAM ? "examlive" : "livetg"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });
    return await r.json();
  }

  // ----- tugma va oyna -----
  if (EXAM) { var hide = document.createElement("style"); hide.textContent = "#livefab,#liveov{display:none!important}"; document.head.appendChild(hide); }
  var btn = document.createElement("button");
  btn.id = "livefab2"; btn.type = "button"; btn.title = EXAM ? "Hozir kim imtihonda" : "Hozir kim shug'ullanyapti"; btn.textContent = "👥";
  btn.style.cssText = "position:fixed;left:10px;bottom:16px;z-index:2147483400;width:38px;height:38px;border-radius:50%;border:1px solid #cfd8ea;background:rgba(255,255,255,.92);font-size:17px;line-height:1;padding:0;box-shadow:0 2px 8px rgba(20,30,60,.18);cursor:pointer;opacity:.85;-webkit-tap-highlight-color:transparent";
  var open = false, data = null;
  function shut() { open = false; var o = document.getElementById("liveov2"); if (o) o.remove(); }
  function row(n, r) { return '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 2px;border-bottom:1px solid #e6ebf5"><span style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(n || "O'quvchi") + '</span><span style="flex:none;font-size:13.5px;text-align:right;max-width:58%">' + r + "</span></div>" }
  function hd(t) { return '<div style="margin:14px 0 2px;font-weight:800;color:#24407a">' + t + "</div>" }
  function no(t) { return '<div style="padding:8px 2px;color:#6b7890">' + t + "</div>" }
  function draw(err) {
    if (!open) return;
    var o = document.getElementById("liveov2");
    if (!o) {
      o = document.createElement("div"); o.id = "liveov2";
      o.style.cssText = "position:fixed;inset:0;z-index:2147483450;background:rgba(20,28,48,.45);display:flex;align-items:flex-end;justify-content:center";
      o.onclick = function (e) { if (e.target === o) shut() }; document.body.appendChild(o);
    }
    var body;
    if (!data) body = no(err ? "⚠️ Ro'yxat yuklanmadi. Internetni tekshiring." : "⏳ Yuklanmoqda…");
    else if (EXAM) {
      var on = data.on || [], dn = data.done || [];
      body = hd("🟢 Hozir imtihonda — " + on.length) + (on.length ? on.map(function (x) { return row(x.n, '<b style="color:#15803d">●</b> <span style="color:#24407a;font-weight:600">' + esc(x.t || PH[x.s] || "") + "</span>") }).join("") : no("Hozir hech kim ishlamayapti")) +
        hd("✅ Bugun tugatganlar — " + dn.length) + (dn.length ? dn.map(function (x) { return row(x.n, '<span style="color:#6b7890">' + esc(x.t) + " da tugatdi</span>") }).join("") : no("Bugun hali hech kim tugatmagan"));
    } else {
      var on2 = data.on || [], td = data.today || [];
      body = hd("🟢 Hozir platformada — " + on2.length) + (on2.length ? on2.map(function (x) { return row(x.n, '<b style="color:#15803d">●</b> <span style="color:#24407a;font-weight:600">' + esc(x.s || "Bosh sahifa") + "</span>") }).join("") : no("Hozir hech kim shug'ullanmayapti")) +
        hd("🕒 Bugun shug'ullanganlar — " + td.length) + (td.length ? td.map(function (x) { return row(x.n, '<span style="color:#6b7890">' + esc(x.t) + (x.s ? " · " + esc(x.s) : "") + "</span>") }).join("") : no("Bugun hali hech kim kirmagan"));
    }
    o.innerHTML = '<div style="background:#fff;width:100%;max-width:480px;max-height:75vh;overflow:auto;border-radius:18px 18px 0 0;padding:14px 16px calc(18px + env(safe-area-inset-bottom));font:15px system-ui,sans-serif;color:#1b2333;text-align:left">' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:17px">' + (EXAM ? "👥 Imtihon — jonli" : "👥 Platforma — jonli") + '</b><button type="button" id="livex2" style="border:0;background:none;font:700 24px system-ui;color:#6b7890;padding:0 4px;cursor:pointer">×</button></div>' + body + "</div>";
    document.getElementById("livex2").onclick = shut;
  }
  async function ping(list) {
    if (!list && document.visibilityState === "hidden") return;
    try { var r = await send(list); if (list) { if (r && r.ok) { data = r; draw() } else draw(true) } }
    catch (e) { if (list) draw(true) }
  }
  btn.onclick = function () { open = true; draw(); ping(true) };
  function put() {
    if (!btn.isConnected) (document.body || document.documentElement).appendChild(btn);
    var a = document.querySelector(".ai-bar"); btn.style.bottom = (a ? a.offsetHeight + 10 : 16) + "px";
  }
  var prev = "", n = 0;
  function key() { var s = state(); return (s.st || "") + "|" + (s.teil || s.sect || "") }
  put(); setTimeout(function () { prev = key(); ping(false) }, 1500);
  setInterval(function () {
    try {
      put(); n++; var k = key();
      if (open && n % 3 === 0) ping(true);
      else if (k !== prev || n % 5 === 0) ping(false); // o'zgarganda darhol, aks holda har 25 soniyada
      prev = k;
    } catch (e) { }
  }, 5000);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") ping(false) });
})();
