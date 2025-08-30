(function () {
  'use strict';

  const storageKey = 'nerest_project_user_key';
  const prefix = 'NEREST-PROJECT-';
  const keyLength = 24;
  const remoteJsonUrl = 'https://dayn777iplas-gay.github.io/g9g87tg90w3erw3/codes.json?';
  const adminUrl = 'https://guns.lol/mr.negotiv';

  const scriptsList = {
    script1: 'https://dayn777iplas-gay.github.io/g9g87tg90w3erw3/dadwadfafaf.js?',
    script2: 'https://example.com/script2.js',
    script3: 'https://example.com/script3.js'
  };

  function generateKeyWithPrefix() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789qwertyuiopasdfghjklzxcvbnm';
    let code = '';
    for (let i = 0; i < keyLength; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + code;
  }

  function cacheBust(url) {
    return url.includes('?') ? url + '&_cb=' + Date.now() : url + '?_cb=' + Date.now();
  }

  function loadExternalScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  }

  let userKey = localStorage.getItem(storageKey);
  if (!userKey) {
    userKey = generateKeyWithPrefix();
    localStorage.setItem(storageKey, userKey);
  }

  // ---------- Стили ----------
  const style = document.createElement("style");
  style.textContent = `
    .overlay {
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      backdrop-filter: blur(15px);
      background: rgba(0,0,0,0.7);
      z-index: 99998;
    }
    .auth-box {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 20px;
      padding: 30px;
      width: 420px;
      text-align: center;
      color: #fff;
      font-family: 'Segoe UI', sans-serif;
      z-index: 99999;
      backdrop-filter: blur(20px);
      box-shadow: 0 0 40px rgba(0,0,0,0.6);
      animation: zoomIn 0.6s ease;
    }
    @keyframes zoomIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .auth-box h2 { margin-bottom: 15px; font-size: 22px; }
    .auth-box code {
      display:block;
      background:rgba(0,0,0,0.4);
      padding:10px 15px;
      border-radius:12px;
      margin:10px 0;
      font-size:18px;
      user-select:text;
    }
    .auth-box button {
      width: 100%; padding: 12px; margin-top: 10px;
      border: none; border-radius: 12px; cursor: pointer;
      font-size: 15px; font-weight: bold;
      background: linear-gradient(90deg, #4caf50, #00c853);
      color: #000; transition: 0.3s;
    }
    .auth-box button:hover { filter: brightness(1.1); }
    .status { margin-top: 15px; font-size: 14px; color: #aaa; min-height:20px; }
  `;
  document.head.appendChild(style);

  // ---------- HTML ----------
  document.body.insertAdjacentHTML("beforeend", `
    <div class="overlay"></div>
    <div class="auth-box">
      <h2>🔒 Доступ к скрипту</h2>
      <p>Отправьте ключ администратору:</p>
      <a href="${adminUrl}" target="_blank" style="color:#4caf50;text-decoration:underline;">${adminUrl}</a>
      <code id="userKey">${userKey}</code>
      <button id="copyKeyBtn">Скопировать ключ</button>
      <div class="status" id="status">Ожидание подтверждения...</div>
    </div>
  `);

  // ---------- Копирование ----------
  document.getElementById("copyKeyBtn").onclick = async () => {
    try { await navigator.clipboard.writeText(userKey); } catch {}
  };

  // ---------- Проверка ключа ----------
  const statusElem = document.getElementById('status');
  const interval = setInterval(() => {
    fetch(cacheBust(remoteJsonUrl))
      .then(res => res.json())
      .then(validKeys => {
        if (validKeys.includes(userKey)) {
          clearInterval(interval);
          statusElem.textContent = '✅ Ключ подтверждён!';
          statusElem.style.color = "#4caf50";

          setTimeout(() => {
            document.querySelector(".overlay").remove();
            document.querySelector(".auth-box").remove();

            // ---------- Выбор скрипта ----------
            const choiceBox = document.createElement("div");
            choiceBox.style.position = "fixed";
            choiceBox.style.top = "50%";
            choiceBox.style.left = "50%";
            choiceBox.style.transform = "translate(-50%, -50%)";
            choiceBox.style.background = "rgba(0,0,0,0.9)";
            choiceBox.style.padding = "30px";
            choiceBox.style.borderRadius = "20px";
            choiceBox.style.color = "#fff";
            choiceBox.style.textAlign = "center";
            choiceBox.style.zIndex = 99999;

            choiceBox.innerHTML = `
              <h2>Выберите скрипт для запуска</h2>
              <button id="script1Btn" style="margin:5px;padding:10px 20px;">Скрипт 1</button>
              <button id="script2Btn" style="margin:5px;padding:10px 20px;">Скрипт 2</button>
              <button id="script3Btn" style="margin:5px;padding:10px 20px;">Скрипт 3</button>
            `;
            document.body.appendChild(choiceBox);

            for (const id in scriptsList) {
              document.getElementById(id + 'Btn').onclick = () => {
                loadExternalScript(cacheBust(scriptsList[id]))
                  .then(() => choiceBox.remove())
                  .catch(() => choiceBox.remove());
              };
            }

          }, 500);

        } else {
          statusElem.textContent = '⏳ Ключ не подтверждён...';
          statusElem.style.color = "#aaa";
        }
      })
      .catch(() => {
        statusElem.textContent = 'Ошибка проверки ключа';
        statusElem.style.color = "#f44336";
      });
  }, 2000);

  // ---------- Усиленная анти-консоль ----------
  (function detectDevTools() {
      const threshold = 160;

      // Перехват клавиш
      document.addEventListener("keydown", e => {
          if (e.key === "F12" ||
              (e.ctrlKey && e.shiftKey && ["I","J","C"].includes(e.key.toUpperCase())) ||
              (e.ctrlKey && e.key.toUpperCase() === "U")
          ) { e.preventDefault(); e.stopPropagation(); }
      }, true);

      document.addEventListener("contextmenu", e => e.preventDefault(), true);

      const check = () => {
          const widthDiff = window.outerWidth - window.innerWidth;
          const heightDiff = window.outerHeight - window.innerHeight;

          if (widthDiff > threshold || heightDiff > threshold) {
              document.body.innerHTML = "";
              window.location.reload();
          }

          const start = Date.now();
          debugger;
          if (Date.now() - start > 100) {
              document.body.innerHTML = "";
              window.location.reload();
          }

          requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
  })();

})();
(function () {
  'use strict';

  const TOGGLE_KEY = "F8";
  let isOpen = false;
  const admins = [];

  const frame = document.createElement("iframe");
  frame.src = "about:blank";
  frame.style.cssText = `
    position: fixed; bottom: 20px; left: 20px;
    width: 450px; height: 350px; border: 2px solid #444;
    border-radius: 10px; z-index: 999999; display: none;
    background: #111827; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
  `;
  document.body.appendChild(frame);

  const doc = frame.contentDocument || frame.contentWindow.document;
  doc.open();
  doc.write(`
<html>
<head>
  <style>
    html, body { margin:0; height:100%; background:#111827; color:white; font-family:sans-serif; display:flex; flex-direction:column;}
    #msgs { flex:1; overflow-y:auto; padding:5px; font-size:14px; background:#1f2937; border-radius:8px; margin:5px;}
    #inp { width:100%; height:50px; border:0; border-top:1px solid #444; padding:5px; font-size:14px; outline:none; background:#0f172a; color:white; resize:none; font-family: monospace;}
  </style>
</head>
<body>
  <div id="msgs"></div>
  <textarea id="inp" placeholder="Сообщение... (Enter=отправить)"></textarea>
</body>
</html>
  `);
  doc.close();

  const msgs = doc.querySelector("#msgs");
  const inp = doc.querySelector("#inp");

  const profilePopup = document.createElement("div");
  profilePopup.style.cssText = `
    position: fixed; bottom: 20px; left: 480px;
    width: 280px; background:#1f2937; border-radius:10px; padding:15px;
    display:none; z-index:1000000; color:white; box-shadow:0 4px 20px rgba(0,0,0,0.6);
  `;
  document.body.appendChild(profilePopup);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "❌";
  closeBtn.style.cssText = "position:absolute; top:5px; right:5px; background:none; color:white; border:none; font-size:16px; cursor:pointer;";
  closeBtn.onclick = () => profilePopup.style.display = "none";
  profilePopup.appendChild(closeBtn);

  const ws = new WebSocket("wss://adadadadad-production.up.railway.app");

  let profileBuffer = [];
  let profileTimeout;

  ws.onopen = () => {
    addSystemMsg("[Система] Подключено к групповому чату!");
    const savedNick = localStorage.getItem("chat_nick");
    const savedPass = localStorage.getItem("chat_pass");
    if(savedNick && savedPass){
        setTimeout(()=> {
            ws.send(`/login ${savedNick} ${savedPass}`);
            addSystemMsg(`[Система] Авто-логин как ${savedNick}`);
        }, 500);
    }
  };

  ws.onmessage = (event) => {
    const msg = event.data;

    if(msg.startsWith("[Система]") || msg.startsWith("[nerchat]") || msg.startsWith("[nerchat-admin]")){
        addSystemMsg(msg);
        return;
    }

    if(msg.startsWith("[Профиль]")){
        showProfile(msg);
        return;
    }

    addPlayerMsg(msg);
  };

  function addSystemMsg(text){
      const m = doc.createElement("div");
      m.textContent = text;
      msgs.appendChild(m);
      msgs.scrollTop = msgs.scrollHeight;
  }

  function addPlayerMsg(text) {
    const m = doc.createElement("div");
    m.style.display = "flex";
    m.style.alignItems = "center";
    m.style.marginBottom = "2px";

    const nickPart = text.split(":")[0];
    const msgPart = text.includes(":") ? text.split(":").slice(1).join(":") : text;

    const avatar = doc.createElement("div");
    avatar.style.width = "24px";
    avatar.style.height = "24px";
    avatar.style.borderRadius = "50%";
    avatar.style.backgroundColor = stringToColor(nickPart);
    avatar.style.color = "white";
    avatar.style.display = "flex";
    avatar.style.alignItems = "center";
    avatar.style.justifyContent = "center";
    avatar.style.fontSize = "14px";
    avatar.style.fontWeight = "bold";
    avatar.style.marginRight = "5px";
    avatar.style.cursor = "pointer";
    avatar.textContent = nickPart[0].toUpperCase();
    avatar.onclick = () => ws.send(`/профиль ${nickPart}`);

    const msgText = doc.createElement("span");
    msgText.style.display = "flex";
    msgText.style.alignItems = "center";

    if(admins.includes(nickPart)){
      const crown = doc.createElement("span");
      crown.textContent = "👑";
      crown.style.marginLeft = "5px";
      msgText.appendChild(crown);
    }

    msgText.appendChild(doc.createTextNode(msgPart ? `${nickPart}: ${msgPart}` : text));

    m.appendChild(avatar);
    m.appendChild(msgText);
    msgs.appendChild(m);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showProfile(msgText){
      profileBuffer.push(msgText);

      clearTimeout(profileTimeout);
      profileTimeout = setTimeout(()=>{
          profilePopup.style.display = "block";
          profilePopup.innerHTML = "";
          profilePopup.appendChild(closeBtn);

          profileBuffer.forEach(msg => {
              const line = msg.replace("[Профиль] ", "");
              const p = document.createElement("div");
              p.textContent = line;
              profilePopup.appendChild(p);
          });

          profileBuffer = [];
      }, 200);
  }

  function stringToColor(str) {
    let hash = 0;
    for(let i=0;i<str.length;i++){ hash = str.charCodeAt(i) + ((hash<<5)-hash); }
    let color = '#';
    for(let i=0;i<3;i++){
      const value = (hash >> (i*8)) & 0xFF;
      color += ('00'+value.toString(16)).substr(-2);
    }
    return color;
  }

  function toggle(force){
    isOpen = force!==undefined?force:!isOpen;
    frame.style.display = isOpen?"block":"none";
    if(isOpen) inp.focus();
  }

  document.addEventListener("keydown", e=>{
    if(e.code===TOGGLE_KEY){ e.preventDefault(); toggle(); }
    if(e.key==="Escape" && isOpen){ toggle(false); }
  });

  inp.addEventListener("keydown", e=>{
    if(e.key==="Enter" && !e.shiftKey){
      e.preventDefault();
      const text = inp.value.trim();
      if(text && ws.readyState === WebSocket.OPEN){
        ws.send(text);
        inp.value="";
      }
    }
  });

})();
