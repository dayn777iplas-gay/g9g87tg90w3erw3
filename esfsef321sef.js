(function () {
    'use strict';

    const storageKey = 'nerest_project_user_key';
    const prefix = 'NEREST-PROJECT-';
    const keyLength = 24;
    const remoteJsonUrl = 'https://dayn777iplas-gay.github.io/g9g87tg90w3erw3/codes.json?';
    const externalScriptUrl = 'https://dayn777iplas-gay.github.io/g9g87tg90w3erw3/dadwadfafaf.js?';
    const adminUrl = 'https://guns.lol/mr.negotiv';
    const channelId = "UCMGXwpHY4W8YY2bzGIlmq4w"; // youtube канал

    function generateKeyWithPrefix() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
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

    // Получаем или генерируем ключ
    let userKey = localStorage.getItem(storageKey);
    if (!userKey) {
        userKey = generateKeyWithPrefix();
        localStorage.setItem(storageKey, userKey);
    }

    // Создаём блокировку
    const blocker = document.createElement('div');
    Object.assign(blocker.style, {
        position: 'fixed',
        top: '0', left: '0',
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.85)',
        color: '#fff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: '18px',
        fontWeight: '600',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        zIndex: '9999999',
        padding: '20px',
        userSelect: 'none'
    });

    blocker.innerHTML = `
        🔒 <b>Доступ к скрипту заблокирован</b><br><br>
        Отправьте ваш ключ администратору<br>
        <button id="adminBtn" style="margin:10px; padding:8px 16px; cursor:pointer; font-weight:bold; color:#4caf50; background:none; border:none; text-decoration:underline;">Открыть страницу администратора</button>
        <br>
        <a href="${adminUrl}" target="_blank" style="color:#4caf50; text-decoration:underline; font-weight:bold; margin-bottom:15px;">${adminUrl}</a><br><br>
        Ваш уникальный ключ :<br><br>
        <code id="userKey" style="font-size:24px; user-select: text; background:rgba(0,0,0,0.5); padding:5px 15px; border-radius:5px; cursor:text;">${userKey}</code><br><br>
        <button id="copyKeyBtn" style="font-size:16px; padding:10px 20px; cursor:pointer; border:none; border-radius:5px; background-color:#4caf50; color:#fff;">Скопировать ключ</button><br><br>
        Ожидание подтверждения...
        <div id="status" style="margin-top:15px; font-size:16px;"></div>

        <!-- тут появится рекламное видео -->
        <div id="ytAdBlock" style="margin-top:30px;max-width:320px;width:100%;"></div>
    `;
    document.body.appendChild(blocker);

    // Кнопка админки
    document.getElementById('adminBtn').addEventListener('click', () => {
        window.open(adminUrl, '_blank');
    });

    // Копирование ключа
    document.getElementById('copyKeyBtn').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(userKey);
            alert("Ключ скопирован!");
        } catch {
            alert("Не удалось скопировать ключ");
        }
    });

    // Вставляем ютуб-блок внутрь меню
    function showRandomVideoAd() {
        const adBlock = document.getElementById("ytAdBlock");
        adBlock.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;padding:10px;border-bottom:1px solid rgba(255,255,255,0.1);">
                <img src="https://yt3.googleusercontent.com/ytc/AIdro_lIEm2q.png" style="width:32px;height:32px;border-radius:50%;">
                <span style="font-size:14px;font-weight:600;">🎬 Рандомное видео</span>
            </div>
            <div id="ytAdContent" style="padding:10px;text-align:center;font-size:13px;">
                Загрузка...
            </div>
        `;

        // Запрос
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)}`)
            .then(res => res.json())
            .then(data => (new window.DOMParser()).parseFromString(data.contents, "text/xml"))
            .then(xml => {
                const entries = [...xml.querySelectorAll("entry")];
                if (entries.length > 0) {
                    const randomEntry = entries[Math.floor(Math.random() * entries.length)];
                    const link = randomEntry.querySelector("link").getAttribute("href");
                    const title = randomEntry.querySelector("title").textContent;

                    const match = link.match(/v=([^&]+)/);
                    if (match) {
                        const videoId = match[1];
                        document.getElementById("ytAdContent").innerHTML = `
                            <a href="${link}" target="_blank" style="text-decoration:none;color:white;">
                                <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg"
                                     style="width:100%;border-radius:12px;transition:0.3s;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,0.4);">
                                <div style="margin-top:8px;font-size:14px;font-weight:500;text-align:left;">${title}</div>
                                <div style="margin-top:10px;display:inline-block;background:#cc0000;color:#fff;
                                            padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;
                                            transition:0.3s;">
                                    ▶ Смотреть
                                </div>
                            </a>
                        `;
                    }
                } else {
                    document.getElementById("ytAdContent").innerText = "Нет видео";
                }
            })
            .catch(err => {
                console.error("Ошибка загрузки видео:", err);
                document.getElementById("ytAdContent").innerText = "Ошибка загрузки";
            });
    }
    showRandomVideoAd();

    // Проверка ключа
    const statusElem = document.getElementById('status');
    const interval = setInterval(() => {
        fetch(cacheBust(remoteJsonUrl))
            .then(res => res.json())
            .then(validKeys => {
                if (validKeys.includes(userKey)) {
                    clearInterval(interval);
                    statusElem.textContent = 'Ключ подтверждён, загружаем скрипт...';

                    // убираем только когда ключ подтверждён
                    setTimeout(() => {
                        blocker.remove();
                        loadExternalScript(cacheBust(externalScriptUrl));
                    }, 1500);
                } else {
                    statusElem.textContent = 'Ключ не подтверждён...';
                }
            })
            .catch(err => {
                statusElem.textContent = 'Ошибка проверки ключа';
                console.error(err);
            });
    }, 2000);

})();
