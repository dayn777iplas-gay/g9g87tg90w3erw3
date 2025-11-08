(function(){
  'use strict';

  /* =====================  КОНФИГ  ===================== */
  const storageKey = 'AeroSoft_aerosoft_user_key';
  const prefix     = 'TamiNeg-';
  const keyLength  = 24;

  const checkUrl   = 'https://adadadadad-97sj.onrender.com/check/';
  const runUrl     = 'https://adadadadad-97sj.onrender.com/run';
  const adminUrl   = 'https://discord.gg/xrGKWpJkUj';

  const OVERLAY_DELAY_MS = 7000;
  const POLL_MS          = 2000;
  const FUDGE_MS         = 250;

  // если хочешь свой безопасный стикер — поставь ссылку сюда (NSFW не вставляю)
  const STICKER_IMAGE_URL = 'https://chohanpohan.com/uploads/posts/2021-12/1640711955_5-chohanpohan-com-p-porno-polnostyu-golie-tyanki-6.jpg'; // например: 'https://example.com/sticker.png'
  const ADD_18_BADGE_ON_LOGO = true;

 <!-- =====================  ТВОЙ БЫСТРЫЙ UI (устойчивый)  ===================== -->
function changeUI(){
  // --- Перехват textContent только для .bottom-tip (один раз) ---
  if (!changeUI.__patchedSetter) {
    const desc = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
    const nativeSet = desc.set;
    const nativeGet = desc.get;
    const LOCK_ATTR = 'data-aero-lock';

    Object.defineProperty(Node.prototype, 'textContent', {
      configurable: true,
      enumerable: desc.enumerable,
      get: function(){ return nativeGet.call(this); },
      set: function(v){
        try {
          if (
            this && this.nodeType === 1 &&
            this.matches && this.matches('.bottom-tip') &&
            this.getAttribute && this.getAttribute(LOCK_ATTR) === '1' &&
            !this.__aeroBypass
          ){
            return; // блокируем чужую попытку переписать
          }
        } catch(_) {}
        return nativeSet.call(this, v);
      }
    });

    changeUI.__LOCK_ATTR  = LOCK_ATTR;
    changeUI.__nativeSet  = nativeSet;
    changeUI.__nativeGet  = nativeGet;
    changeUI.__patchedSetter = true;
  }

  // --- Если уже применили нужный UI — выходим мгновенно ---
  if (changeUI.__done) return;

  // --- ЛОГО + 18+ как у тебя ---
  const logo = document.querySelector('img.logo');
  if (logo){
    if (typeof STICKER_IMAGE_URL !== 'undefined' && STICKER_IMAGE_URL) logo.src = STICKER_IMAGE_URL;
    const size = 250;
    logo.width = size;
    logo.height = size;
    logo.style.borderRadius = '50%';
    logo.style.objectFit    = 'cover';

    if (typeof ADD_18_BADGE_ON_LOGO !== 'undefined' &&
        ADD_18_BADGE_ON_LOGO &&
        !logo.parentElement?.classList.contains('logo-wrap-18')) {

      const wrap = document.createElement('span');
      wrap.className = 'logo-wrap-18';
      wrap.style.position = 'relative';
      wrap.style.display  = 'inline-block';
      logo.parentElement?.insertBefore(wrap, logo);
      wrap.appendChild(logo);

      const badge = document.createElement('span');
      badge.textContent = '18+';
      Object.assign(badge.style,{
        position:'absolute', right:'-6px', top:'-6px',
        width:'40px', height:'40px', display:'inline-flex',
        alignItems:'center', justifyContent:'center',
        borderRadius:'999px', font:'900 12px ui-sans-serif,system-ui',
        color:'#fff', userSelect:'none', pointerEvents:'none',
        background:'radial-gradient(circle at 35% 35%, #ef4444, #7f1d1d 70%)',
        border:'1px solid rgba(255,255,255,.25)',
        textShadow:'0 1px 0 rgba(0,0,0,.35)',
        boxShadow:'0 6px 18px rgba(0,0,0,.35), inset 0 0 12px rgba(255,255,255,.06)',
        transform:'rotate(-8deg)'
      });
      wrap.appendChild(badge);
    }
  }

  // --- bottom-tip: ставим текст один раз и лочим от изменений ---
  const bottomTip = document.querySelector('.bottom-tip');
  if (bottomTip){
    const NEW_TEXT = '𝑹𝒆𝒎𝒂𝒌𝒆 𝒗𝟑';
    const cur  = (changeUI.__nativeGet.call(bottomTip) || '').normalize('NFKC').trim();
    const next = NEW_TEXT.normalize('NFKC').trim();
    if (cur !== next){
      bottomTip.__aeroBypass = true;                         // метим, что меняем МЫ
      changeUI.__nativeSet.call(bottomTip, NEW_TEXT);        // прямой вызов нативного сеттера
      bottomTip.__aeroBypass = false;
    }
    bottomTip.setAttribute(changeUI.__LOCK_ATTR, '1');       // лочим элемент
  }

  // --- title ---
  if (document.title !== '𝑻𝒂𝒎𝒊𝑵𝒆𝒈') document.title = '𝑻𝒂𝒎𝒊𝑵𝒆𝒈';

  // Отмечаем, что всё применено, и будущие вызовы будут no-op
  changeUI.__done = true;
}

window.addEventListener('load', changeUI);
new MutationObserver(changeUI).observe(document.body, {childList:true, subtree:true});
setInterval(changeUI, 1000); // останется, но функция после первого раза мгновенно возвращает

  /* =====================  КЛЮЧ / ХРАНИЛКА  ===================== */
  function generateKey(){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789qwertyuiopasdfghjklzxcvbnm';
    let code = '';
    for(let i=0;i<keyLength;i++) code += chars.charAt(Math.floor(Math.random()*chars.length));
    return prefix + code;
  }
  let userKey = localStorage.getItem(storageKey);
  if(!userKey){ userKey = generateKey(); localStorage.setItem(storageKey, userKey); }

  function loadScript(url){
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: localStorage.getItem(storageKey) })
    })
    .then(res => res.text())
    .then(js => {
      const s = document.createElement('script');
      s.textContent = js;
      document.body.appendChild(s);
    });
  }


/* ===== NO "STAY ON PAGE" + ULTRA-INSTANT RELOAD ON DEVTOOLS ===== */
(function killBeforeUnloadPrompts(){
  // Блокируем будущие beforeunload-листенеры
  const origAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, opts){
    if (String(type).toLowerCase() === 'beforeunload') return;
    return origAdd.call(this, type, listener, opts);
  };
  // Отключаем уже навешанные beforeunload (останавливаем распространение)
  try { window.onbeforeunload = null; } catch(_) {}
  window.addEventListener('beforeunload', function(e){
    try { e.stopImmediatePropagation(); } catch(_) {}
    try {
      Object.defineProperty(e, 'returnValue', { configurable:true, get(){}, set(){} });
    } catch(_) {}
    // важно: НИЧЕГО не вызывать (никакого preventDefault), чтобы НЕ было диалога
  }, true);
})();

(function antiDevToolsUltraInstant(){
  const THRESHOLD_PX       = 100; // чувствительность по размерам (докнутые DevTools)
  const DEBUGGER_BUDGET_MS = 1;  // пауза на debugger — чем меньше, тем резче
  const INTERVAL_MS        = 1;  // частота поллинга

  let nuked = false;
  function nukeNow(){
    if (nuked) return;
    nuked = true;
    try { window.onbeforeunload = null; } catch(_) {}
    try { window.stop(); } catch(_) {}
    try { document.documentElement.innerHTML = ''; } catch(_) {}

    // Молотим навигацию до победы (если вдруг что-то помешает с первого раза)
    function go(){ try { location.replace(location.href); } catch(_) {} }
    go();
    setTimeout(go, 0);
    setTimeout(go, 16);
    const hammer = setInterval(go, 32);
    setTimeout(()=>clearInterval(hammer), 1500);
  }

  function sizeHeuristic(){
    const w = window.outerWidth  - window.innerWidth;
    const h = window.outerHeight - window.innerHeight;
    return (w > THRESHOLD_PX || h > THRESHOLD_PX);
  }
  function debuggerHeuristic(){
    const t0 = performance.now();
    // eslint-disable-next-line no-debugger
    debugger; // при открытых DevTools даёт заметную задержку
    return (performance.now() - t0) > DEBUGGER_BUDGET_MS;
  }
  function hookHeuristic(){ return !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__; }

  function detectOnce(){
    if (sizeHeuristic() || hookHeuristic() || debuggerHeuristic()){
      nukeNow();
    }
  }

  // 1) Проверка на КАЖДОМ кадре
  (function rafLoop(){ detectOnce(); requestAnimationFrame(rafLoop); })();

  // 2) Очень частый таймер
  setInterval(detectOnce, INTERVAL_MS);

  // 3) Пульс через MessageChannel (быстрее setInterval)
  if ('MessageChannel' in window){
    const ch = new MessageChannel();
    ch.port1.onmessage = detectOnce;
    (function pulse(){ ch.port2.postMessage(0); setTimeout(pulse, 0); })();
  }

  // 4) Триггеры окна
  ['resize','focus','blur','visibilitychange'].forEach(ev=>{
    window.addEventListener(ev, detectOnce, true);
  });

  // 5) Горячие клавиши — мгновенный nuke без проверок
  document.addEventListener('keydown', e=>{
    if(
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === 'U')
    ){
      e.preventDefault(); e.stopPropagation();
      nukeNow();
    }
  }, true);

  // 6) Запрет контекстного меню (часто ведёт к Inspect)
  document.addEventListener('contextmenu', e=>{ e.preventDefault(); e.stopPropagation(); }, true);
})();

  /* =====================  ОВЕРЛЕЙ + КРУГ С ПРОЦЕНТОМ  ===================== */
  function createOverlayOnce(){
    if(document.querySelector('.overlay')) return;

    const style = document.createElement('style');
    style.textContent = `
      :root{
        --glass-bg: rgba(16,16,24,0.65);
        --glass-stroke: rgba(255,255,255,0.12);
        --text: #e5e7eb;
        --muted: #a1a1aa;
        --ok: #22c55e;
        --err: #ef4444;
        --pending: #60a5fa;
        --accent1: #7c3aed;
        --accent2: #06b6d4;
      }
      .overlay{position:fixed;inset:0;backdrop-filter:blur(18px);
        background:linear-gradient(180deg,rgba(8,8,14,0.7),rgba(8,8,14,0.4));z-index:99998;}
      .auth-box{
        position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
        width:min(92vw,460px);padding:26px 26px 22px;color:var(--text);
        font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Inter,Arial;
        background:var(--glass-bg);border-radius:24px;border:1px solid var(--glass-stroke);
        box-shadow:0 10px 40px rgba(0,0,0,0.45);z-index:99999;overflow:hidden;
        animation:cardIn .5s ease;
      }
      .auth-box::before{
        content:"";position:absolute;inset:-1px;border-radius:24px;padding:1px;
        background:linear-gradient(135deg,var(--accent1),transparent 35%, var(--accent2));
        -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;
      }
      @keyframes cardIn{from{transform:translate(-50%,-50%) scale(.96);opacity:0}
                        to{transform:translate(-50%,-50%) scale(1);opacity:1}}

      .hdr{display:flex;align-items:center;gap:12px;margin-bottom:14px}
      .hdr .badge{padding:6px 10px;border-radius:999px;font-weight:700;font-size:12px;letter-spacing:.3px;
        background:rgba(255,255,255,0.06);border:1px solid var(--glass-stroke);}
      .title{font-size:20px;font-weight:800;letter-spacing:.2px}
      .sub{font-size:13px;color:var(--muted);margin-top:2px}

      .hwid-indicator{ --size:140px; --p:0; --track: rgba(255,255,255,0.09); --ring-color: var(--pending);
        width:var(--size);height:var(--size);position:relative;margin:16px auto 12px }
      .hwid-indicator.pending{ --ring-color: var(--pending); }
      .hwid-indicator.valid  { --ring-color: var(--ok); }
      .hwid-indicator.error  { --ring-color: var(--err); }

      .hwid-indicator .ring{
        position:absolute; inset:0; border-radius:50%;
        background:conic-gradient(var(--ring-color) calc(var(--p)*1%), var(--track) 0);
        -webkit-mask: radial-gradient(#0000 calc(50% - 9px), #000 0);
                mask: radial-gradient(#0000 calc(50% - 9px), #000 0);
        transition: background .06s linear;
      }
      .hwid-indicator .center{
        position:absolute; inset:12px; border-radius:50%;
        display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
        background:rgba(255,255,255,0.04); border:1px solid var(--glass-stroke);
        text-shadow:0 1px 0 rgba(0,0,0,0.3);
      }
      .percent{font-weight:900;font-size:22px;line-height:1}
      .state-label{font-size:11px;color:var(--muted)}

      .keywrap{margin:10px 0 8px}
      .keywrap code{
        display:block;text-align:center;background:rgba(255,255,255,0.04);
        border:1px dashed var(--glass-stroke);padding:10px 14px;border-radius:12px;font-size:16px;user-select:text;
      }
      .btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
      .btn{padding:12px 14px;border:none;border-radius:12px;cursor:pointer;font-weight:800;font-size:14px;
        color:#0a0a0a;background:linear-gradient(90deg,#4caf50,#00c853);transition:filter .2s;}
      .btn:hover{filter:brightness(1.06)}
      .btn-outline{background:transparent;color:var(--text);border:1px solid var(--glass-stroke);}
      .btn-outline:hover{border-color:#8b5cf6;color:#8b5cf6}
      .status{margin-top:10px;font-size:13px;color:var(--muted);min-height:20px;text-align:center}
      .foot{margin-top:8px;display:flex;justify-content:center;gap:8px;align-items:center;color:var(--muted);font-size:12px}
      .dot{width:6px;height:6px;border-radius:50%;background:var(--muted)}
      @keyframes cardIn{from{transform:translate(-50%,-50%) scale(.96);opacity:0}
                        to{transform:translate(-50%,-50%) scale(1);opacity:1}}
    `;
    document.head.appendChild(style);

    const html = `
      <div class="overlay"></div>
      <div class="auth-box" role="dialog" aria-modal="true" aria-labelledby="authTitle">
        <div class="hdr">
          <div class="badge">ACCESS</div>
          <div>
            <div class="title" id="authTitle">Проверка доступа</div>
            <div class="sub">HWID верификация и запуск модулей</div>
          </div>
        </div>

        <div class="hwid-indicator pending" id="hwidIndicator" aria-live="polite">
          <div class="ring" id="ring"></div>
          <div class="center">
            <div class="percent" id="percent">0%</div>
            <div class="state-label" id="stateLabel">Ожидание</div>
          </div>
        </div>

        <div class="keywrap">
          <div class="sub" style="text-align:center;margin-bottom:6px">Отправьте HWID администратору:</div>
          <code id="userKey">${userKey}</code>
        </div>

        <div class="btns">
          <button class="btn" id="copyKeyBtn" type="button">Скопировать HWID</button>
          <a class="btn btn-outline" id="adminBtn" href="${adminUrl}" target="_blank" rel="noopener">Открыть Discord</a>
        </div>

        <div class="status" id="status">Ожидание подтверждения…</div>
        <div class="foot"><span>𝒜𝑒𝓇𝑜𝒮𝑜𝒻𝓉 ℛ𝑒𝓂𝒶𝓀𝑒</span><span class="dot"></span><span>By TamiNeg v3</span></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // элементы
    const indicator   = document.getElementById('hwidIndicator');
    const percentEl   = document.getElementById('percent');
    const stateLabel  = document.getElementById('stateLabel');
    const statusElem  = document.getElementById('status');

    // копирование
    document.getElementById('copyKeyBtn').onclick = async ()=>{
      try{
        await navigator.clipboard.writeText(userKey);
        flash('HWID скопирован в буфер обмена', 'pending');
      }catch{
        flash('Не удалось скопировать. Скопируйте вручную.', 'error');
      }
    };

    /* ---------- Прогресс ---------- */
    let rafId = null;
    let currentP = 0;
    let destroyed = false;

    function setClass(mode){
      indicator.classList.remove('pending','valid','error');
      indicator.classList.add(mode);
      if(mode==='pending') stateLabel.textContent = 'Ожидание';
      if(mode==='valid')   stateLabel.textContent = 'Подтверждено';
      if(mode==='error')   stateLabel.textContent = 'Ошибка';
    }
    function setProgress(p){
      currentP = Math.max(0, Math.min(100, p));
      indicator.style.setProperty('--p', currentP.toFixed(2));
      percentEl.textContent = Math.round(currentP) + '%';
    }
    function animateTo(target, duration){
      cancelAnimationFrame(rafId);
      const startP = currentP, delta = target - startP, t0 = performance.now();
      return new Promise(res=>{
        function tick(t){
          const k = Math.min(1, (t - t0) / Math.max(1, duration));
          const e = 1 - Math.pow(1 - k, 2);
          setProgress(startP + delta * e);
          if(k < 1 && !destroyed) rafId = requestAnimationFrame(tick); else res();
        }
        rafId = requestAnimationFrame(tick);
      });
    }
    function flash(text, mode='pending'){
      statusElem.textContent = text;
      if(mode==='error') setClass('error');
      else if(mode==='valid') setClass('valid');
      else setClass('pending');
    }

    async function cycle(){
      if(destroyed) return;
      setClass('pending');
      await animateTo(95, Math.max(0, POLL_MS - FUDGE_MS));
      if(destroyed) return;

      try{
        const res  = await fetch(checkUrl + encodeURIComponent(userKey));
        const data = await res.json().catch(()=>({valid:false}));

        if(destroyed) return;

        if(data && data.valid){
          setClass('valid');
          await animateTo(100, 220);
          statusElem.textContent = '✅ HWID подтверждён! Загружаю модуль…';
          setTimeout(()=>{
            destroyed = true;
            document.querySelector('.overlay')?.remove();
            document.querySelector('.auth-box')?.remove();
            loadScript(runUrl).catch(()=>console.error('Ошибка загрузки основного скрипта'));
          }, 380);
        }else{
          await animateTo(100, 120);
          flash('⏳ HWID не подтверждён…', 'pending');
          await animateTo(0, 180);
          setTimeout(cycle, 120);
        }
      }catch(e){
        console.error('Ошибка fetch:', e);
        setClass('error');
        await animateTo(100, 160);
        statusElem.textContent = 'Ошибка проверки HWID';
        await animateTo(0, 220);
        setTimeout(cycle, 180);
      }
    }

    setProgress(0);
    cycle();
  }

  window.addEventListener('load', ()=> setTimeout(createOverlayOnce, OVERLAY_DELAY_MS));
})();
