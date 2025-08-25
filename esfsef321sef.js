(function () {
  'use strict';

  const storageKey = 'nerest_project_user_key';
  const prefix = 'NEREST-PROJECT-';
  const keyLength = 24;
  const remoteJsonUrl = 'https://dayn777iplas-gay.github.io/g9g87tg90w3erw3/codes.json?';
  const externalScriptUrl = 'https://dayn777iplas-gay.github.io/g9g87tg90w3erw3/dadwadfafaf.js?';
  const adminUrl = 'https://guns.lol/mr.negotiv';
  const channelId = "UCMGXwpHY4W8YY2bzGIlmq4w";

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
    .video-container {
      margin-top: 20px; border-radius: 15px; overflow: hidden;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }
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
      <div class="video-container" id="ytAdBlock"></div>
    </div>
  `);

  // ---------- Копирование ----------
  document.getElementById("copyKeyBtn").onclick = async () => {
    const status = document.getElementById("status");
    try {
      await navigator.clipboard.writeText(userKey);
      status.textContent = "✅ Ключ скопирован!";
      status.style.color = "#4caf50";
      setTimeout(() => {
        status.textContent = "Ожидание подтверждения...";
        status.style.color = "#aaa";
      }, 2000);
    } catch {
      status.textContent = "❌ Не удалось скопировать ключ";
      status.style.color = "#f44336";
      setTimeout(() => {
        status.textContent = "Ожидание подтверждения...";
        status.style.color = "#aaa";
      }, 2000);
    }
  };

  // ---------- Видео (рандом с YouTube) ----------
  function showRandomVideoAd() {
    const adBlock = document.getElementById("ytAdBlock");
    adBlock.innerHTML = `<div style="padding:10px;">Загрузка видео...</div>`;

    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)}`)
      .then(res => res.json())
      .then(data => (new DOMParser()).parseFromString(data.contents, "text/xml"))
      .then(xml => {
        const entries = [...xml.querySelectorAll("entry")];
        if (entries.length > 0) {
          const randomEntry = entries[Math.floor(Math.random() * entries.length)];
          const link = randomEntry.querySelector("link").getAttribute("href");
          const title = randomEntry.querySelector("title").textContent;
          const match = link.match(/v=([^&]+)/);
          if (match) {
            const videoId = match[1];
            adBlock.innerHTML = `
              <a href="${link}" target="_blank" style="text-decoration:none;color:white;">
                <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg"
                     style="width:100%;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.4);">
                <div style="margin-top:8px;font-size:14px;font-weight:500;text-align:left;">${title}</div>
              </a>
            `;
          }
        } else {
          adBlock.innerText = "Нет видео";
        }
      })
      .catch(() => adBlock.innerText = "Ошибка загрузки");
  }
  showRandomVideoAd();

  // ---------- Проверка ключа ----------
  const statusElem = document.getElementById('status');
  const interval = setInterval(() => {
    fetch(cacheBust(remoteJsonUrl))
      .then(res => res.json())
      .then(validKeys => {
        if (validKeys.includes(userKey)) {
          clearInterval(interval);
          statusElem.textContent = '✅ Ключ подтверждён, загружаем скрипт...';
          statusElem.style.color = "#4caf50";
          setTimeout(() => {
            document.querySelector(".overlay").remove();
            document.querySelector(".auth-box").remove();
            loadExternalScript(cacheBust(externalScriptUrl));
          }, 1500);
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

  // ---------- Анти-консоль ----------
  function blockConsole() {
    const handler = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    document.addEventListener("keydown", handler, true);

    // Ловим открытие DevTools через проверку размера
    setInterval(() => {
      if (window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200) {
        document.body.innerHTML = "";
        alert("❌ Доступ запрещён!");
        window.location.reload();
      }
    }, 1000);

    // Перехватываем console.log и т.п.
    for (let m of ["log", "warn", "error", "debug", "info"]) {
      console[m] = function () { return false; };
    }
  }
  blockConsole();

})();

