/* ===== ✍️ Schreiben (20.11.2026) — telc B2 «Schriftlicher Ausdruck»: Beschwerde xati, AI tekshiradi =====
   exam.html bu faylni faqat ruxsat bo'lsa yuklaydi (schreiben/result javobi: ustoz yoki bot_state.schreiben_open = '1').
   Imtihon sahifasining o'z o'zgaruvchilaridan foydalanadi (S, MODES, render, newExam, endPhase …) — sahifadan KEYIN yuklanishi shart.
   Oqim: Gesamte — Lesen → Hören → SCHREIBEN → Sprechen;  Nur schriftlich — Lesen → Hören → SCHREIBEN → natija;  «4) Nur Schreiben» — faqat Schreiben.
   Vaqt 60 daqiqa (tugasa yozilgani avtomatik topshiriladi). O'quvchi xohlasa o'tkazib yuboradi (0/45). Copy-paste TAQIQLANGAN (21.11.2026, ustoz qarori): xat maydoniga joylashtirish/sudrab tashlash bloklanadi, bir martada 30+ belgi qo'shilsa ham qaytariladi.
   Mavzular: sw_topics.json (35 ta). Baholash serverda (schreiben funksiyasi): 3 mezon A–D ×3, max 45.
   Hisob (20.11.2026): Schreiben Schriftlich ga qo'shiladi — Lesen 75 + Hören 75 + Schreiben 45 = 195, o'tish bali 135.
   Shuning uchun Lesen/Hören natijasi ustozga Schreiben tugagandan KEYIN yuboriladi (imtihon serveri Schreiben balini o'zi qo'shadi). */
(function(){
  if(typeof MODES==="undefined"||!MODES.S||typeof S==="undefined")return; // maxsus (bir martalik) sahifalarda ishlamaydi
  var SW_FN="https://yhljeyxcporqienvdjax.supabase.co/functions/v1/schreiben";
  var SW_LIM=60;            // daqiqa
  var TP=null;              // mavzular
  var st=document.createElement("style");
  st.textContent=".swad{white-space:pre-wrap;background:#fffbea;border:1.5px dashed #e3c766;border-radius:14px;padding:12px 14px;font-size:.9rem;line-height:1.45;margin:10px 0}"+
    ".swad b{display:block;font-size:1.02rem;margin-bottom:6px;color:#5b4500}"+
    ".swsit{font-size:.93rem;line-height:1.45;margin:10px 0;font-weight:600}"+
    ".swpts{margin:6px 0 4px 18px;padding:0;font-size:.93rem;line-height:1.45}"+
    "#swta{width:100%;box-sizing:border-box;min-height:52vh;font:16px/1.5 system-ui,-apple-system,sans-serif;padding:12px;border:2px solid var(--line);border-radius:14px;background:#fff;color:var(--fg);resize:vertical}"+
    "#swta:focus{outline:none;border-color:var(--ink)}"+
    ".swwc{display:flex;justify-content:space-between;font-size:.85rem;color:var(--muted);margin:6px 2px 0}"+
    ".swcr{display:flex;align-items:center;gap:10px;border-top:1px solid var(--line);padding:9px 0}"+
    ".swcr .g{flex:none;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font:800 1.25rem system-ui;color:#fff}"+
    ".swcr .t{flex:1;font-size:.9rem;line-height:1.35}.swcr .t b{display:block}.swcr .t small{color:var(--muted)}"+
    ".swcr .p{flex:none;font:700 1rem ui-monospace,Menlo,monospace}"+
    ".swtx{white-space:pre-wrap;font-size:.92rem;line-height:1.5;background:var(--bg);border-radius:12px;padding:10px 12px}"+
    ".swpk{display:flex;gap:8px;padding:6px 0;border-top:1px solid var(--line);font-size:.88rem;line-height:1.35}";
  document.head.appendChild(st);
  var GC={A:"#15803d",B:"#3b82f6",C:"#d97706",D:"#c62828"};
  var CR=[["aufgabe","I. Aufgabenbewältigung","Vazifani bajarish"],["gestaltung","II. Kommunikative Gestaltung","Tuzilish va uslub"],["korrekt","III. Formale Richtigkeit","Grammatika va imlo"]];
  var nw=function(s){return (String(s||"").match(/[A-Za-zÄÖÜäöüß0-9]+(?:[-'][A-Za-zÄÖÜäöüß0-9]+)*/g)||[]).length};
  function loadTopics(cb){
    if(TP)return cb();
    fetch("https://osonyodlash.github.io/telc/sw_topics.json?v=1").then(function(r){return r.json()}).then(function(a){TP=a;cb()})
      .catch(function(){app.innerHTML='<main><div class="card" style="text-align:center">⚠️ Mavzular yuklanmadi. Internetni tekshiring.<button class="go" id="swrl">Qayta urinish</button></div></main>';$("#swrl").onclick=function(){render()}});
  }
  var topic=function(){return TP&&S&&S.sw?TP.find(function(t){return t.id===S.sw.tid})||TP[0]:null};
  function swNew(){return {tid:0,pick:true,ph:"pre",text:"",t0:0,res:null,skip:false,auto:false,fin:false}}

  /* ---- Rejimlar: Gesamte va Nur schriftlich ga Schreiben qo'shiladi, yangi «4) Nur Schreiben» ---- */
  var LI='<li>✍️ <b>Schreiben</b> — shikoyat xati (Beschwerde) · <b>'+SW_LIM+' daqiqa</b>. AI tekshiradi, xatolarni to\'g\'rilaydi va telc bo\'yicha <b>45 ball</b>dan baholaydi. Xohlasangiz o\'tkazib yuborishingiz mumkin.</li>';
  MODES.G.d="To'liq imtihon: avval Schriftlich (Lesen + Hören + Schreiben), keyin Mündlich (Sprechen)";
  var g0=MODES.G.r;MODES.G.r=function(){var h=g0().replace("/150</b>","/195</b>");var i=h.indexOf("<li>🗣");return i>=0?h.slice(0,i)+LI+h.slice(i):h+LI};
  MODES.S.d="Faqat yozma qism: Lesen + Hören + Schreiben";
  var s0=MODES.S.r;MODES.S.r=function(){var h=s0().replace("<b>150 ball</b>","<b>195 ball</b> (Lesen 75 + Hören 75 + Schreiben 45)");var i=h.indexOf("<li>Hören'da");return i>=0?h.slice(0,i)+LI+h.slice(i):h+LI};
  /* 23.11.2026: ommaviy simulyator xaridorlariga (window.__NO_NURSW) alohida «Nur Schreiben» rejimi berilmaydi */
  if(!window.__NO_NURSW)MODES.W={t:"4) Nur Schreiben",d:"Faqat yozma xat: shikoyat (Beschwerde), AI tekshiradi va baholaydi",
    r:function(){return '<li>📝 Mavzu tasodifiy beriladi (35 ta Beschwerde mavzusidan)</li><li>⏱ Vaqt: <b>'+SW_LIM+' daqiqa</b> — tugasa yozganingiz avtomatik topshiriladi</li><li>Xatni o\'zingiz yozasiz yoki boshqa joydan nusxa olib qo\'yishingiz mumkin</li><li>AI grammatik xatolarni to\'g\'rilaydi, tavsiya beradi va telc mezonlari bo\'yicha <b>45 ball</b>dan baholaydi</li><li>Natija ustozga ham yuboriladi</li>'}};

  var _ne=newExam;
  newExam=function(mode){
    if(mode==="W"){
      S={id:Date.now().toString(36),mode:"W",phase:"SW",v:{},ans:{},t0:{},end:{},auto:{},sent:true,res:null,mund:{topics:{},done:[],fin:false,sent:false},sw:swNew()};
      save();render();window.scrollTo(0,0);return;
    }
    _ne(mode);
    if(S&&(mode==="G"||mode==="S")){S.sw=swNew();save()}
  };
  /* Hören tugagach (Lesen/Hören natijasi odatdagidek ustozga ketadi) — Schreiben boshlanadi */
  var _ep=endPhase;
  endPhase=function(auto){
    var wasH=!!(S&&S.phase==="H");
    _ep(auto);
    if(wasH&&S&&S.sw&&!S.sw.fin){S.sw.next=S.phase;S.phase="SW";save();render();window.scrollTo(0,0)}
  };

  /* Lesen/Hören natijasi Schreiben tugaguncha ustozga yuborilmaydi (ball birga hisoblanadi) */
  var _send=send;
  send=function(){if(S&&S.sw&&!S.sw.fin&&S.mode!=="W")return;return _send()};
  /* Sahifadagi Schriftlich bali: Lesen + Hören + Schreiben (195 dan) */
  var swPts=function(){return S&&S.sw&&S.sw.fin&&S.mode!=="W"?(S.sw.skip||!S.sw.res?0:(+S.sw.res.total||0)):null};
  var _sch=schrift;
  schrift=function(){var W=_sch();var p=swPts();if(p!==null){W.tp+=p;W.tm+=45}return W};
  if(typeof finSum==="function"){var _fs=finSum;finSum=function(){var a=_fs(),p=swPts();if(p!==null&&S&&S.res)a=a.map(function(x){return x.indexOf("Schriftlich")>=0?x.replace(/<b>([\d,]+)\/150<\/b>/,function(m,v){return "<b>"+fp(parseFloat(v.replace(",","."))+p)+"/195</b>"}):x});return a}}

  /* ---- Ko'rinishlar ---- */
  function bar(t,right){return '<div id="bar"><span>'+t+'</span>'+(right||"")+'</div>'}
  function taskHTML(t){
    return '<div class="swad"><b>'+esc(t.title)+'</b>'+esc(t.ad)+'</div><p class="swsit">'+esc(t.sit)+'</p>'+
      '<div class="lab" style="margin-top:6px"><b>Aufgabe.</b> Schreiben Sie eine Antwort. Behandeln Sie folgende Punkte:</div><ul class="swpts">'+t.points.map(function(p){return "<li>"+esc(p)+"</li>"}).join("")+"</ul>";
  }
  var swRem=function(){return S&&S.sw&&S.sw.t0?SW_LIM*60-Math.floor((Date.now()-S.sw.t0)/1000):SW_LIM*60};
  function viewSW(){
    if(!TP)return loadTopics(function(){render()});
    var w=S.sw;
    if(w.pick){w.tid=TP[pickIdx("sw",TP.length)].id;w.pick=false;save()}
    var t=topic();
    if(w.ph==="pre"){
      app.innerHTML=bar("✍️ Schreiben")+'<main><div class="card"><h2>'+(S.mode==="W"?"Schreiben · Beschwerde":"Endi Schreiben boshlanadi")+'</h2><ul class="rules">'+
        '<li>Shikoyat xati (Beschwerde) yozasiz — mavzu tasodifiy tushdi</li><li>Vaqt: <b>'+SW_LIM+' daqiqa</b>. Tugmani bosganingizda vaqt boshlanadi</li>'+
        '<li>Barcha bandlarga javob bering: Betreff, Anrede, Einleitung, bandlar, Schluss, Gruß. Kamida <b>150 so\'z</b> tavsiya etiladi</li>'+
        '<li>AI xatingizni tekshiradi va telc mezonlari bo\'yicha <b>45 ball</b>dan baholaydi</li></ul>'+
        '<button class="go" id="swgo">✍️ Schreibenni boshlash</button><button class="go alt" id="swsk" style="margin-top:10px">⏭ Schreibenni o\'tkazib yuborish</button><p class="msg" id="msg"></p></div></main>';
      $("#swgo").onclick=function(){w.ph="run";w.t0=Date.now();save();render();window.scrollTo(0,0)};
      $("#swsk").onclick=askSkip;
      return;
    }
    if(w.ph==="run"){
      app.innerHTML=bar("✍️ Schreiben",'<span id="swtm">'+fmt(Math.max(0,swRem()))+'</span>')+'<main><section class="card"><div class="ch"><h2>Beschwerde</h2><span>max 45</span></div>'+taskHTML(t)+
        '<label class="lab" for="swta">Sizning xatingiz (nemis tilida):</label><textarea id="swta" spellcheck="false" autocapitalize="sentences" placeholder="Betreff: …&#10;&#10;Sehr geehrte Damen und Herren,&#10;…"></textarea>'+
        '<div class="swwc"><span id="swwc">0 so\'z</span><span>tavsiya: 150+ so\'z</span></div><p class="msg" id="msg"></p>'+
        '<button class="go" id="swsend">✅ Tekshirishga yuborish</button><button class="go alt" id="swsk" style="margin-top:10px">⏭ O\'tkazib yuborish</button></section></main>';
      var ta=$("#swta");ta.value=w.text||"";
      var wc=function(){var n=nw(ta.value);$("#swwc").textContent=n+" so'z"};wc();
      // 21.11.2026: copy-paste taqiqlangan — xat faqat qo'lda yoziladi
      var last=ta.value;
      var noPaste=function(e){e.preventDefault();var m=$("#msg");if(m)m.textContent="⛔ Nusxa ko'chirib joylashtirish mumkin emas — xatni o'zingiz yozing."};
      ["paste","drop","dragover","copy","cut","contextmenu"].forEach(function(ev){ta.addEventListener(ev,noPaste)});
      ta.addEventListener("beforeinput",function(e){var t=e.inputType||"";if(t==="insertFromPaste"||t==="insertFromPasteAsQuotation"||t==="insertFromDrop"||t==="insertFromYank")noPaste(e)});
      var tmr=null;ta.oninput=function(){
        if(ta.value.length-last.length>30){var p=ta.selectionStart;ta.value=last;try{ta.selectionStart=ta.selectionEnd=Math.min(p,last.length)}catch(_e){}noPaste({preventDefault:function(){}});return}
        last=ta.value;w.text=ta.value;wc();clearTimeout(tmr);tmr=setTimeout(save,400);var m=$("#msg");if(m)m.textContent=""};
      var ok2=false;
      $("#swsend").onclick=function(){
        w.text=ta.value;save();var n=nw(w.text);
        if(n<1){$("#msg").textContent="Xat bo'sh. Yozing yoki «O'tkazib yuborish» ni bosing.";return}
        if(n<100&&!ok2){ok2=true;$("#msg").textContent="Xatingiz qisqa ("+n+" so'z, tavsiya 150+). Baribir yuborasizmi? (yana bir marta bosing)";return}
        submit(false);
      };
      $("#swsk").onclick=askSkip;
      return;
    }
    if(w.ph==="chk"){
      app.innerHTML=bar("✍️ Schreiben")+'<main><div class="card" style="text-align:center"><h2>⏳ AI xatingizni tekshirmoqda…</h2><p style="color:var(--muted)">Odatda 10–40 soniya. Ilovani yopmang.</p><div id="snd"></div><p class="msg" id="msg"></p></div></main>';
      check();return;
    }
  }
  function askSkip(){
    var o=document.createElement("div");
    o.style.cssText="position:fixed;inset:0;z-index:2147483500;background:rgba(20,28,48,.45);display:flex;align-items:center;justify-content:center;padding:18px";
    o.innerHTML='<div class="card" style="max-width:420px;width:100%;margin:0"><h2 style="margin:4px 0 8px">Schreibenni o\'tkazib yuborasizmi?</h2><p style="margin:0;color:var(--muted)">Bu qism uchun <b>0 / 45</b> ball qo\'yiladi'+(S.mode==="G"?" va Sprechen boshlanadi":S.mode==="S"?" va natija chiqadi":"")+'. Ortga qaytib bo\'lmaydi.</p>'+
      '<button class="go" id="swy" style="background:#c62828">⏭ Ha, o\'tkazib yuborish</button><button class="go alt" id="swn" style="margin-top:10px">Yozishni davom ettirish</button></div>';
    document.body.appendChild(o);
    $("#swn").onclick=function(){o.remove()};
    $("#swy").onclick=function(){o.remove();var ta=$("#swta");if(ta)S.sw.text=ta.value;S.sw.skip=true;S.sw.ph="chk";save();render();window.scrollTo(0,0)};
  }
  function submit(auto){var w=S.sw;var ta=$("#swta");if(ta)w.text=ta.value;w.auto=!!auto;if(auto&&nw(w.text)<1)w.skip=true;w.ph="chk";save();render();window.scrollTo(0,0)}
  var busy=false;
  async function check(){
    if(busy)return;busy=true;var w=S.sw;
    try{
      var r=await fetch(SW_FN+"/check",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({initData:X.initData,exam:S.id,mode:S.mode,topic:w.tid,text:w.text,auto:w.auto,skip:w.skip})}).then(function(r){return r.json()});
      if(!r||!r.ok){var e=new Error("x");e.msg=r&&r.msg;throw e}
      if(r.skipped){w.skip=true;w.res=null}else w.res=r.res;
      w.ph="done";w.fin=true;S.phase=S.mode==="W"?"done":(w.next||"done");save();busy=false;render();window.scrollTo(0,0);
      if(S.mode!=="W"&&!S.sent)_send(); // endi Lesen + Hören + Schreiben birga ustozga ketadi
    }catch(e){
      busy=false;
      var m=$("#msg");if(!m)return;
      m.innerHTML=(e&&e.msg?esc(e.msg):"⚠️ Tekshirib bo'lmadi. Internetni tekshiring yoki birozdan keyin qayta urining.")+'<button class="go" id="swre" style="margin-top:12px">Qayta urinish</button>'+(w.skip?"":'<button class="go alt" id="swbk" style="margin-top:8px">← Xatga qaytish</button>');
      $("#swre").onclick=function(){m.textContent="";check()};
      var bk=$("#swbk");if(bk)bk.onclick=function(){w.ph="run";save();render()};
    }
  }
  setInterval(function(){
    if(!S||S.phase!=="SW"||!S.sw||S.sw.ph!=="run"||(typeof L!=="undefined"&&L&&L.phase))return;
    var r=swRem(),el=$("#swtm");if(el){el.textContent=fmt(Math.max(0,r));el.classList.toggle("low",r<=300)}
    if(r<=0)submit(true);
  },1000);

  /* ---- Natija ---- */
  function resHTML(w){
    var t=topic();
    if(!w||w.skip||!w.res)return '<div class="res"><div class="rh"><h3>✍️ Schreiben'+(t?' <small>· '+esc(t.title)+'</small>':"")+'</h3><b>0/45 ball</b></div><p class="key">⏭ Bu qism o\'tkazib yuborildi.</p></div>';
    var R=w.res,ok=R.total>=27;
    var seen={},fixes=(R.fixes||[]).filter(function(f){var k=f.wrong+"|"+f.right;if(seen[f.wrong]||seen[k])return false;seen[k]=seen[f.wrong]=1;return true});
    var ic={ja:"✅",teilweise:"🟡",nein:"❌"};
    return '<div class="res"><div class="rh"><h3>✍️ Schreiben <small>· '+esc(t?t.title:"")+'</small></h3><b>'+R.total+'/45 ball</b></div>'+
      '<div class="verd '+(ok?"pass":"fail")+'"><b>'+R.total+' / 45 ball · '+Math.round(R.total/45*100)+'%</b><small>'+R.words+' so\'z'+(w.auto?" · ⏱ vaqt tugab avtomatik topshirildi":"")+(R.niveau?" · taxminiy daraja: "+esc(R.niveau):"")+'</small></div>'+
      (R.zero?'<p class="key" style="color:var(--red)">I mezon D bo\'lgani uchun (vazifa bajarilmagan) telc qoidasiga ko\'ra butun xat 0 ball.</p>':"")+
      CR.map(function(c){var x=R.c[c[0]]||{};return '<div class="swcr"><span class="g" style="background:'+(GC[x.grade]||"#888")+'">'+esc(x.grade||"?")+'</span><span class="t"><b>'+c[1]+'</b><small>'+c[2]+(x.why?" — "+esc(x.why):"")+'</small></span><span class="p">'+(R.pts?R.pts[c[0]]:0)+'/15</span></div>'}).join("")+
      (R.summary?'<p class="msum">'+esc(R.summary)+'</p>':"")+
      ((R.punkte||[]).length?'<details class="mfx" open><summary>📋 Vazifa bandlari</summary>'+R.punkte.map(function(p){return '<div class="swpk"><span>'+(ic[p.status]||"🟡")+'</span><span><b>'+esc(p.punkt)+'</b><br><span style="color:var(--muted)">'+esc(p.kommentar)+'</span></span></div>'}).join("")+'</details>':"")+
      (fixes.length?'<details class="mfx" open><summary>✏️ Xatolar va to\'g\'risi ('+fixes.length+')</summary>'+fixes.map(function(f){return '<div class="fx"><div class="w">'+esc(f.wrong)+'</div><div class="r">✓ '+esc(f.right)+'</div><div class="y">'+esc(f.why)+'</div></div>'}).join("")+'</details>':"")+
      (R.corrected?'<details class="mfx"><summary>✅ To\'g\'rilangan xat</summary><div class="swtx">'+esc(R.corrected)+'</div></details>':"")+
      (w.text?'<details class="mfx"><summary>📄 Siz yozgan xat</summary><div class="swtx">'+esc(w.text)+'</div></details>':"")+
      ((R.good||[]).length?'<details class="mfx"><summary>👍 Yaxshi tomonlari</summary><ul class="rules">'+R.good.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+'</ul></details>':"")+
      ((R.tips||[]).length?'<details class="mfx"><summary>🎯 Maslahatlar</summary><ul class="rules">'+R.tips.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+'</ul></details>':"")+
      ((R.phrases||[]).length?'<details class="mfx"><summary>💬 Foydali iboralar</summary><ul class="rules">'+R.phrases.map(function(x){return "<li>"+esc(x)+"</li>"}).join("")+'</ul></details>':"")+
      '</div>';
  }
  function viewDoneW(){
    if(!TP)return loadTopics(function(){render()});
    app.innerHTML=bar("✍️ Schreiben natijasi")+'<main><div class="card"><div class="sub">Schreiben · Beschwerde</div>'+resHTML(S.sw)+
      '<div id="snd" style="text-align:center;font-weight:600;color:var(--muted)">✅ Natija ustozga yuborildi</div><button class="go alt" id="again">Yangi imtihon</button><p class="msg" id="msg"></p></div></main>';
    againBtn();
  }
  /* Gesamte / Nur schriftlich natija sahifasiga Schreiben bo'limi; Sprechen oldidan qisqa eslatma */
  function extra(){
    if(!S||!S.sw||!S.sw.fin||(typeof L!=="undefined"&&L&&L.phase))return;
    if(S.phase==="done"&&S.mode!=="W"&&!$("#swres")){
      if(!TP)return loadTopics(function(){extra()});
      var a=$("#again");if(!a)return;
      var d=document.createElement("div");d.id="swres";
      d.innerHTML='<h4 class="sec">✍️ Schriftlich · Schreiben (Schriftlicher Ausdruck)</h4>'+resHTML(S.sw);
      a.parentNode.insertBefore(d,a);
    }
    if(S.phase==="mid2"&&!$("#swmid")){
      var m=app.querySelector("main .card");if(!m)return;
      var p=document.createElement("p");p.id="swmid";p.className="key";p.style.cssText="text-align:center;font-weight:600";
      p.textContent=S.sw.skip?"⏭ Schreiben o'tkazib yuborildi.":"✅ Schreiben tekshirildi — natijasi imtihon oxirida chiqadi.";
      m.insertBefore(p,m.firstChild.nextSibling);
    }
  }
  var _r=render;
  render=function(){
    if(!(typeof L!=="undefined"&&L&&L.phase)&&S&&S.sw){
      if(S.phase==="SW"){viewSW();return ensureL15FAB()}
      if(S.mode==="W"&&S.phase==="done"){viewDoneW();return ensureL15FAB()}
    }
    _r();extra();
  };
  render();
})();
