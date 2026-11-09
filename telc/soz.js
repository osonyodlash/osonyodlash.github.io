/* So'z yodlash o'yini — telc B2 platformasi.
   So'zlar: telc/sozlar.json  ->  {"kunlar":[{"sana":"YYYY-MM-DD","sozlar":[["o'zbekcha","nemischa"], ...]}]}
   Faqat oxirgi 7 kunning so'zlari o'yinga tushadi. Natijalar hech qayerga yuborilmaydi. */
(function () {
  var KUN = 7, VARIANT = 10;
  var CSS =
    ".sz{max-width:520px;margin:0 auto;padding:14px 14px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1b2333}" +
    ".sz-top{display:flex;justify-content:space-between;align-items:center;font-size:14px;color:#5b6577;margin-bottom:10px}" +
    ".sz-bar{height:6px;background:#e4e9f4;border-radius:6px;overflow:hidden;margin-bottom:16px}.sz-bar i{display:block;height:100%;background:#3b6ef5;transition:width .3s}" +
    ".sz-q{background:#fff;border-radius:16px;padding:22px 14px;text-align:center;box-shadow:0 4px 16px rgba(30,42,68,.08);margin-bottom:14px}" +
    ".sz-q small{display:block;color:#8a93a6;font-size:12px;margin-bottom:6px}.sz-q b{font-size:28px;line-height:1.2;word-break:break-word}" +
    ".sz-g{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    ".sz-o{position:relative;border:2px solid #dde3ef;background:#fff;color:#1b2333;border-radius:12px;padding:12px 8px;font-size:15px;font-weight:600;text-align:center;cursor:pointer;min-height:50px;word-break:break-word;-webkit-tap-highlight-color:transparent}" +
    ".sz-o:disabled{cursor:default}" +
    ".sz-o.sz-y{background:#e6f8ec;border-color:#22a55a;color:#127a3e}.sz-o.sz-y::after{content:'✅';position:absolute;top:-8px;right:-6px;font-size:16px}" +
    ".sz-o.sz-q2{background:#fdecec;border-color:#e0453a;color:#b3261e}.sz-o.sz-q2::after{content:'❌';position:absolute;top:-8px;right:-6px;font-size:16px}" +
    ".sz-o.sz-fade{opacity:.45}" +
    ".sz-fb{margin-top:14px;border-radius:12px;padding:12px 14px;font-size:15px;display:none}" +
    ".sz-fb.y{display:block;background:#e6f8ec;color:#127a3e}.sz-fb.x{display:block;background:#fdecec;color:#b3261e}" +
    ".sz-fb .ans{display:block;margin-top:6px;color:#127a3e;font-weight:700;font-size:17px}" +
    ".sz-btn{display:block;width:100%;margin-top:12px;background:#3b6ef5;color:#fff;border:0;border-radius:12px;padding:14px;font-size:16px;font-weight:700;cursor:pointer}" +
    ".sz-btn.alt{background:#eef2fb;color:#3b6ef5}" +
    ".sz-end{text-align:center;background:#fff;border-radius:16px;padding:26px 16px;box-shadow:0 4px 16px rgba(30,42,68,.08)}.sz-end .big{font-size:40px;font-weight:800;margin:8px 0}" +
    ".sz-list{margin-top:16px;text-align:left;font-size:14px}.sz-list div{padding:7px 0;border-bottom:1px solid #eef1f6}.sz-list b{color:#127a3e}" +
    ".sz-msg{text-align:center;color:#5b6577;padding:30px 10px}";

  function css() {
    if (document.getElementById("sz-css")) return;
    var s = document.createElement("style"); s.id = "sz-css"; s.textContent = CSS; document.head.appendChild(s);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function mix(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function ymd(d) { var p = function (n) { return ("0" + n).slice(-2); }; return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); }

  function pool(data) {
    var from = new Date(); from.setDate(from.getDate() - (KUN - 1)); var min = ymd(from);
    var seen = {}, out = [];
    ((data && data.kunlar) || []).forEach(function (k) {
      if (!k || k.sana < min) return;
      (k.sozlar || []).forEach(function (p) {
        if (!p || !p[0] || !p[1]) return;
        var key = (p[0] + "|" + p[1]).toLowerCase();
        if (seen[key]) return; seen[key] = 1; out.push({ uz: String(p[0]).trim(), de: String(p[1]).trim() });
      });
    });
    return out;
  }

  function mount(el, data) {
    css();
    var W = pool(data);
    el.innerHTML = '<div class="sz"></div>'; var root = el.firstChild;
    if (W.length < 2) { root.innerHTML = '<div class="sz-msg">📚 Hozircha so\'zlar yo\'q.<br>Ustoz yangi so\'zlarni tez orada qo\'shadi.</div>'; return; }

    var order, idx, ok, wrong;
    function start() { order = mix(W); idx = 0; ok = 0; wrong = []; ask(); }

    function options(w) {
      var others = mix(W.filter(function (x) { return x.de.toLowerCase() !== w.de.toLowerCase(); }));
      var seen = {}, list = [];
      for (var i = 0; i < others.length && list.length < VARIANT - 1; i++) {
        var k = others[i].de.toLowerCase(); if (seen[k]) continue; seen[k] = 1; list.push(others[i].de);
      }
      list.push(w.de); return mix(list);
    }

    function ask() {
      if (idx >= order.length) return finish();
      var w = order[idx], opts = options(w);
      root.innerHTML =
        '<div class="sz-top"><span>📖 So\'z ' + (idx + 1) + ' / ' + order.length + '</span><span>✅ ' + ok + ' &nbsp; ❌ ' + wrong.length + '</span></div>' +
        '<div class="sz-bar"><i style="width:' + Math.round(idx / order.length * 100) + '%"></i></div>' +
        '<div class="sz-q"><small>Nemischasini toping</small><b>' + esc(w.uz) + '</b></div>' +
        '<div class="sz-g">' + opts.map(function (o) { return '<button class="sz-o" type="button">' + esc(o) + '</button>'; }).join("") + '</div>' +
        '<div class="sz-fb"></div>';
      var btns = root.querySelectorAll(".sz-o"), fb = root.querySelector(".sz-fb");
      [].forEach.call(btns, function (b, i) {
        b.onclick = function () {
          var right = opts[i] === w.de;
          [].forEach.call(btns, function (x, j) {
            x.disabled = true;
            if (opts[j] === w.de) x.classList.add("sz-y");
            else if (j === i) x.classList.add("sz-q2");
            else x.classList.add("sz-fade");
          });
          if (right) { ok++; fb.className = "sz-fb y"; fb.innerHTML = "✅ To'g'ri! <b>" + esc(w.uz) + "</b> — " + esc(w.de); }
          else { wrong.push(w); fb.className = "sz-fb x"; fb.innerHTML = "❌ Xato. Siz tanladingiz: " + esc(opts[i]) + '<span class="ans">To\'g\'ri javob: ' + esc(w.de) + "</span>"; }
          var nx = document.createElement("button"); nx.className = "sz-btn"; nx.type = "button";
          nx.textContent = idx + 1 < order.length ? "Keyingi ➜" : "Natijani ko'rish";
          nx.onclick = function () { idx++; ask(); window.scrollTo(0, 0); };
          root.appendChild(nx);
          try { var H = window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback; H && H.notificationOccurred(right ? "success" : "error"); } catch (e) {}
        };
      });
    }

    function finish() {
      var html = '<div class="sz-end"><div>Mashq tugadi 🎉</div><div class="big">' + ok + ' / ' + order.length + '</div>' +
        '<div style="color:#5b6577">' + (wrong.length ? "Xato qilingan so'zlarni yana bir bor ko'rib chiqing:" : "Barcha so'zlarni to'g'ri topdingiz! 👏") + '</div>';
      if (wrong.length) html += '<div class="sz-list">' + wrong.map(function (w) { return '<div>' + esc(w.uz) + ' — <b>' + esc(w.de) + '</b></div>'; }).join("") + '</div>';
      html += '</div>';
      if (wrong.length) html += '<button class="sz-btn" type="button" id="sz-w">Faqat xatolarni qayta ishlash</button>';
      html += '<button class="sz-btn alt" type="button" id="sz-a">Boshidan boshlash</button>';
      root.innerHTML = html;
      var bw = root.querySelector("#sz-w"); if (bw) { var bad = wrong.slice(); bw.onclick = function () { order = mix(bad); idx = 0; ok = 0; wrong = []; ask(); }; }
      root.querySelector("#sz-a").onclick = start;
    }
    start();
  }

  function load(el, url) {
    el.innerHTML = '<div class="sz-msg">Yuklanmoqda…</div>';
    return fetch((url || "sozlar.json") + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (d) { mount(el, d); })
      .catch(function () { el.innerHTML = '<div class="sz-msg">⚠️ So\'zlarni yuklab bo\'lmadi. Internetni tekshirib qayta oching.</div>'; });
  }

  window.SozOyin = { mount: mount, load: load };
})();
