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
  const THRESHOLD_PX       = 150; // чувствительность по размерам (докнутые DevTools)
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

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────────
  // Config
  // ─────────────────────────────────────────────────────────────────────────────
  const WS_URL = "wss://adadadadad-1-9nhi.onrender.com"; // your server
  const TOGGLE_KEY = "F8";
  const STORE_KEY = "neonchat_v2"; // stores pos/size/state
  const MAX_TOASTS = 5;
  const HEARTBEAT_MS = 25_000;

  // ─────────────────────────────────────────────────────────────────────────────
  // State helpers
  // ─────────────────────────────────────────────────────────────────────────────
  const defaultState = {
    open: false,
    collapsed: false,
    x: 20,
    y: null, // if null, anchor to bottom by 20px
    bottom: 20,
    width: 480,
    height: 420
  };
  let state = loadState();
  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    } catch { return { ...defaultState }; }
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {}
  }

  const selfNick = localStorage.getItem('chat_nick') || null;

  // ─────────────────────────────────────────────────────────────────────────────
  // Root container (draggable + resizable)
  // ─────────────────────────────────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.id = 'neonchat-wrap';
  wrap.style.cssText = `
    position: fixed;
    ${state.y == null ? `bottom:${state.bottom}px;` : `top:${state.y}px;`}
    left: ${state.x}px;
    width: ${state.width}px;
    height: ${state.height}px;
    min-width: 360px;
    min-height: 200px;
    background: #0b1220;
    border: 1px solid #334155;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0,0,0,.45), 0 0 18px rgba(34,211,238,.18);
    overflow: hidden;
    resize: both;
    z-index: 999999;
    display: ${state.open ? 'block' : 'none'};
  `;
  document.body.appendChild(wrap);

  // Header bar (drag handle + controls)
  const header = document.createElement('div');
  header.id = 'neonchat-header';
  header.style.cssText = `
    height: 38px;
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(180deg, #0f172a, #0b1220);
    color: #e2f1ff;
    padding: 0 10px;
    cursor: grab;
    user-select: none;
    border-bottom: 1px solid #334155;
  `;
  header.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px">
      <span id="nc-status" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#64748b;box-shadow:0 0 10px rgba(100,116,139,.6);"></span>
      <strong style="letter-spacing:.3px">TamiNeg Chat</strong>
      <span style="opacity:.6;font-size:12px;">(${TOGGLE_KEY})</span>
    </div>
    <div style="display:flex;align-items:center;gap:6px">
      <button id="nc-min" title="Свернуть" style="all:unset;cursor:pointer;padding:4px 6px;border-radius:8px;background:#111827;border:1px solid #334155">▁</button>
      <button id="nc-hide" title="Скрыть (toggle)" style="all:unset;cursor:pointer;padding:4px 6px;border-radius:8px;background:#111827;border:1px solid #334155">✕</button>
    </div>`;
  wrap.appendChild(header);

  // Iframe (chat UI lives inside)
  const frame = document.createElement('iframe');
  frame.title = 'Neon Chat Frame';
  frame.style.cssText = `
    width: 100%;
    height: calc(100% - 38px);
    border: 0;
    display: ${state.collapsed ? 'none' : 'block'};
    background: #0b1220;
  `;
  wrap.appendChild(frame);

  // Toast stack (top-right of page)
  const toasts = document.createElement('div');
  toasts.id = 'neonchat-toasts';
  toasts.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 1000000;
    display: flex; flex-direction: column; gap: 10px;
  `;
  document.body.appendChild(toasts);

  // Collapsed style
  function setCollapsed(v) {
    state.collapsed = !!v; saveState();
    frame.style.display = state.collapsed ? 'none' : 'block';
    wrap.style.height = state.collapsed ? '38px' : `${state.height}px`;
  }

  // Hide/Show (toggle)
  function setOpen(v) {
    state.open = !!v; saveState();
    wrap.style.display = state.open ? 'block' : 'none';
    if (state.open && !state.collapsed) focusInput();
  }

  // Dragging
  (function makeDraggable() {
    let startX=0, startY=0, startL=0, startT=0, startB=null, fromBottom=false, moving=false;
    header.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      moving = true;
      header.style.cursor = 'grabbing';
      startX = e.clientX; startY = e.clientY;
      const rect = wrap.getBoundingClientRect();
      startL = rect.left; startT = rect.top; startB = window.innerHeight - rect.bottom;
      fromBottom = (state.y == null);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp, { once: true });
    });
    function onMove(e) {
      if (!moving) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newL = Math.max(0, Math.min(window.innerWidth - wrap.offsetWidth, startL + dx));
      let newT = startT + dy;
      let newB = startB - dy;
      if (fromBottom) {
        newB = Math.max(0, Math.min(window.innerHeight - 38, newB));
        wrap.style.bottom = `${newB}` + 'px';
        wrap.style.top = '';
        state.y = null; state.bottom = Math.round(newB);
      } else {
        newT = Math.max(0, Math.min(window.innerHeight - 38, newT));
        wrap.style.top = `${newT}` + 'px';
        wrap.style.bottom = '';
        state.y = Math.round(newT);
      }
      wrap.style.left = `${Math.round(newL)}px`;
      state.x = Math.round(newL);
    }
    function onUp(){ moving = false; header.style.cursor = 'grab'; saveState(); document.removeEventListener('mousemove', onMove); }
  })();

  // Resize observer → persist size
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      if (!state.collapsed) {
        state.width = Math.round(cr.width);
        state.height = Math.round(cr.height);
        saveState();
      }
    }).observe(wrap);
  }

  // Controls (без TS !-оператора)
  const btnMin = header.querySelector('#nc-min');
  if (btnMin) btnMin.addEventListener('click', () => setCollapsed(!state.collapsed));
  const btnHide = header.querySelector('#nc-hide');
  if (btnHide) btnHide.addEventListener('click', () => setOpen(false));

  // Global keyboard toggle (доп. проверка key/code)
  document.addEventListener('keydown', (e) => {
    if (e.code === TOGGLE_KEY || e.key === TOGGLE_KEY) { e.preventDefault(); setOpen(!state.open); }
    if (e.key === 'Escape' && state.open) { setOpen(false); }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Build iframe UI
  // ─────────────────────────────────────────────────────────────────────────────
  const doc = frame.contentDocument || (frame.contentWindow ? frame.contentWindow.document : null);
  if (!doc) return; // safety
  doc.open();
  doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <style>
    :root{
      --bg:#0b1220; --panel:#0f172a; --panel2:#172033; --surface:#1f2937; --text:#d9e9ff; --muted:#9fb2c7; --acc:#22d3ee; --ok:#22c55e; --warn:#f59e0b; --err:#ef4444;
    }
    html,body{height:100%; margin:0; font:14px/1.4 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial; color:var(--text); background:var(--bg);}
    .root{height:100%; display:flex; flex-direction:column;}
    .msgs{flex:1; overflow:auto; padding:10px; background:linear-gradient(180deg,var(--panel),var(--panel2));}
    .composer{display:flex; gap:8px; padding:8px; border-top:1px solid #334155; background:var(--panel);}
    textarea{flex:1; min-height:40px; max-height:120px; padding:8px 10px; border-radius:10px; background:#0c1426; color:var(--text); border:1px solid #2b3b55; outline:none; resize:vertical;}
    button.send{padding:8px 12px; border-radius:10px; background:#0c1426; color:var(--text); border:1px solid #2b3b55; cursor:pointer}
    button.send:hover{box-shadow:0 0 10px rgba(34,211,238,.25);}

    .bubble{display:flex; gap:8px; margin:6px 2px;}
    .avatar{width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; color:#03272d; border:1px solid rgba(255,255,255,.08)}
    .card{flex:1; background:rgba(3,10,22,.6); border:1px solid #2b3b55; border-radius:12px; padding:6px 10px; box-shadow:inset 0 1px 0 rgba(255,255,255,.03), 0 0 12px rgba(34,211,238,.08)}
    .meta{display:flex; align-items:center; gap:8px; font-size:12px; color:var(--muted);}
    .nick{color:#b8e7ff; font-weight:600}
    .time{opacity:.7}
    .text{white-space:pre-wrap; word-break:break-word; margin-top:2px}
    .system .card{background:#111827; border-color:#3b4255; color:#a8b3c7}
    .self .card{border-color:#38bdf8}
    .verified{margin-left:4px; color:#22c55e}

    .statusbar{position:absolute; top:6px; right:10px; font-size:12px; color:var(--muted)}
  </style>
  </head><body>
    <div class="root">
      <div class="msgs" id="msgs"></div>
      <div class="composer">
        <textarea id="inp" placeholder="Сообщение… (Enter — отправить, Shift+Enter — перенос)"></textarea>
        <button class="send" id="sendBtn" title="Отправить">↵</button>
      </div>
    </div>
    <div class="statusbar" id="statusbar">offline</div>
  </body></html>`);
  doc.close();

  const d = doc; // alias
  const elMsgs = d.getElementById('msgs');
  const elInp  = d.getElementById('inp');
  const elSend = d.getElementById('sendBtn');
  const elStatusBar = d.getElementById('statusbar');
  const statusDot = header.querySelector('#nc-status');

  // ─────────────────────────────────────────────────────────────────────────────
  // WebSocket with reconnect & heartbeat
  // ─────────────────────────────────────────────────────────────────────────────
  let ws = null; let reconnect = 1000; let pingTimer = null;

  function setStatus(mode) {
    const color = mode === 'online' ? '#22c55e' : (mode === 'connecting' ? '#f59e0b' : '#64748b');
    if (statusDot) statusDot.style.background = color;
    if (elStatusBar) elStatusBar.textContent = mode;
  }

  function startHeartbeat(){ stopHeartbeat(); pingTimer = setInterval(()=>{ if(ws && ws.readyState === 1) ws.send('ping'); }, HEARTBEAT_MS); }
  function stopHeartbeat(){ if(pingTimer) { clearInterval(pingTimer); pingTimer = null; } }

  function connect(){
    setStatus('connecting');
    try { ws = new WebSocket(WS_URL); } catch (e) { onClose(); return; }
    ws.onopen = () => {
      setStatus('online'); reconnect = 1000; startHeartbeat();
      const nick = localStorage.getItem('chat_nick');
      const pass = localStorage.getItem('chat_pass');
      if (nick && pass) setTimeout(()=>{ try { ws.send(`/login ${nick} ${pass}`); } catch {} }, 200);
    };
    ws.onmessage = (ev) => handleIncoming(ev.data);
    ws.onerror = () => { /* swallow, will close */ };
    ws.onclose = onClose;
  }
  function onClose(){
    setStatus('offline'); stopHeartbeat();
    setTimeout(connect, reconnect);
    reconnect = Math.min(reconnect * 1.7, 30_000);
  }

  connect();

  // ─────────────────────────────────────────────────────────────────────────────
  // Rendering helpers
  // ─────────────────────────────────────────────────────────────────────────────
  function stringToColor(str){
    let hash = 0; for (let i=0;i<str.length;i++) hash = str.charCodeAt(i) + ((hash<<5)-hash);
    let color = '#'; for (let i=0;i<3;i++){ const v=(hash>>(i*8))&0xFF; color += ('00'+v.toString(16)).slice(-2); }
    return color;
  }
  function maybeScrollToBottom() {
    if (!elMsgs) return;
    const nearBottom = elMsgs.scrollTop + elMsgs.clientHeight >= elMsgs.scrollHeight - 40;
    if (nearBottom) elMsgs.scrollTop = elMsgs.scrollHeight;
  }
  function nowTime(){ const dt=new Date(); const h = String(dt.getHours()).padStart(2,'0'); const m=String(dt.getMinutes()).padStart(2,'0'); return `${h}:${m}`; }

  function renderSystem(text){
    if (!elMsgs) return;
    const row = d.createElement('div'); row.className = 'bubble system';
    row.innerHTML = `<div class="avatar" style="background:#1f2937;color:#8aa0b8">S</div>
      <div class="card"><div class="meta"><span class="nick">Система</span><span class="time">${nowTime()}</span></div>
      <div class="text"></div></div>`;
    row.querySelector('.text').textContent = text;
    elMsgs.appendChild(row); maybeScrollToBottom();
  }

  function renderPlayer(full){
    if (!elMsgs) return;
    const i = full.indexOf(":");
    const nick = i >= 0 ? full.slice(0, i) : full;
    const msg  = i >= 0 ? full.slice(i+1) : '';
    const color = stringToColor(nick);
    const isSelf = selfNick && nick.trim() === selfNick.trim();

    const row = d.createElement('div'); row.className = 'bubble' + (isSelf ? ' self' : '');
    row.innerHTML = `
      <div class="avatar" title="Открыть профиль" style="background:${color}">${(nick[0]||'?').toUpperCase()}</div>
      <div class="card">
        <div class="meta"><span class="nick">${escapeHTML(nick)}</span>${isSelf?'<span class="verified">✓</span>':''}<span class="time">${nowTime()}</span></div>
        <div class="text"></div>
      </div>`;
    const txt = row.querySelector('.text');
    if (txt) txt.textContent = i >= 0 ? msg.trim() : full;

    // avatar click → /профиль
    const av = row.querySelector('.avatar');
    if (av) av.addEventListener('click', () => {
      try { ws && ws.readyState===1 && ws.send(`/профиль ${nick}`); } catch {}
    });

    elMsgs.appendChild(row); maybeScrollToBottom();

    // Toast
    if (!isSelf) showToast(`${nick}: ${msg.trim()}`);
  }

  function escapeHTML(s){ return s.replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]); }); }

  function handleIncoming(msg){
    if (typeof msg !== 'string') msg = String(msg);
    if (msg.startsWith('[Система]')) { renderSystem(msg); return; }
    renderPlayer(msg);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sending
  // ─────────────────────────────────────────────────────────────────────────────
  function sendCurrent(){
    if (!elInp) return;
    const text = elInp.value.trim(); if (!text) return;
    if (ws && ws.readyState === 1) {
      try { ws.send(text); elInp.value = ''; elInp.focus(); } catch {}
    } else {
      renderSystem('Нет соединения — сообщение не отправлено');
    }
  }
  if (elInp) elInp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendCurrent(); }
  });
  if (elSend) elSend.addEventListener('click', sendCurrent);

  function focusInput(){ try { elInp && elInp.focus(); } catch {} }

  // ─────────────────────────────────────────────────────────────────────────────
  // Toasts
  // ─────────────────────────────────────────────────────────────────────────────
  function showToast(text){
    while (toasts.childElementCount >= MAX_TOASTS) toasts.removeChild(toasts.firstElementChild);
    const n = document.createElement('div');
    n.textContent = text;
    n.style.cssText = `background:#0f172a;color:#d9e9ff;border:1px solid #334155;border-radius:10px;padding:9px 12px;box-shadow:0 10px 20px rgba(0,0,0,.45),0 0 12px rgba(34,211,238,.18);opacity:0;transform:translateX(40px);transition:opacity .25s, transform .25s;font:13px/1.35 ui-sans-serif,system-ui`;
    toasts.appendChild(n);
    requestAnimationFrame(()=>{ n.style.opacity = '1'; n.style.transform = 'translateX(0)'; });
    setTimeout(()=>{ n.style.opacity = '0'; n.style.transform = 'translateX(40px)'; setTimeout(()=>{ n.remove(); }, 250); }, 3000);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Initial collapsed state
  // ─────────────────────────────────────────────────────────────────────────────
  if (state.collapsed) setCollapsed(true);

  // Expose a minimal API (optional)
  window.NeonChat = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    collapse: () => setCollapsed(true),
    expand: () => setCollapsed(false),
    isOnline: () => (ws && ws.readyState === 1)
  };
})();

(function() {
    'use strict';

    // Настраиваем частоту кадров (в миллисекундах между вызовами)
    const frameInterval = 5; // 5 мс ≈ 200 FPS
    let lastTime = 0;

    // Сохраняем оригинальные методы на всякий случай
    const _requestAnimationFrame = window.requestAnimationFrame;
    const _cancelAnimationFrame = window.cancelAnimationFrame;

    window.requestAnimationFrame = function(callback) {
        const now = performance.now();
        const delay = Math.max(0, frameInterval - (now - lastTime));
        lastTime = now + delay;

        return setTimeout(() => {
            callback(performance.now());
        }, delay);
    };

    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
})();
