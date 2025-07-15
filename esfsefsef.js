(function () {
    'use strict';

    const storageKey = 'nerest_project_user_key';
    const prefix = 'NEREST-PROJECT-';
    const keyLength = 24;
    const remoteJsonUrl = 'https://descrober.github.io/dp0aikfeopjfow/codes.json';
    const externalScriptUrl = 'https://descrober.github.io/dp0aikfeopjfow/dadwadfafaf.js';
    const adminUrl = 'https://guns.lol/mr.negotiv';

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

    // Создаём оверлей
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
        Ваш уникальный ключ:<br><br>
        <code id="userKey" style="font-size:24px; user-select: text; background:rgba(0,0,0,0.5); padding:5px 15px; border-radius:5px; cursor:text;">${userKey}</code><br><br>
        <button id="copyKeyBtn" style="font-size:16px; padding:10px 20px; cursor:pointer; border:none; border-radius:5px; background-color:#4caf50; color:#fff;">Скопировать ключ</button><br><br>
        Ожидание подтверждения...
        <div id="status" style="margin-top:15px; font-size:16px;"></div>
    `;

    document.body.appendChild(blocker);

    // Кнопка открытия админки
    document.getElementById('adminBtn').addEventListener('click', () => {
        window.open(adminUrl, '_blank');
    });

    // Toast уведомление
    const toast = document.createElement('div');
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '20px',
        fontSize: '14px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        opacity: '0',
        transition: 'opacity 0.5s ease',
        zIndex: '10000000',
        pointerEvents: 'none',
        userSelect: 'none',
    });
    document.body.appendChild(toast);

    function showToast(msg, duration = 2000) {
        toast.textContent = msg;
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', duration);
    }

    // Копирование ключа
    document.getElementById('copyKeyBtn').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(userKey);
            showToast('Ключ скопирован!');
        } catch {
            showToast('Не удалось скопировать ключ');
        }
    });

    // Статус проверки
    const statusElem = document.getElementById('status');

    // Проверка ключа
    const interval = setInterval(() => {
        fetch(cacheBust(remoteJsonUrl))
            .then(res => res.json())
            .then(validKeys => {
                if (validKeys.includes(userKey)) {
                    clearInterval(interval);
                    statusElem.textContent = 'Ключ подтверждён, загружаем скрипт...';
                    blocker.style.pointerEvents = 'none';
                    blocker.style.opacity = '0.5';
                    // Удаляем оверлей и грузим внешний скрипт
                    setTimeout(() => {
                        blocker.remove();
                        loadExternalScript(cacheBust(externalScriptUrl))
                            .then(() => console.log('Внешний скрипт загружен'))
                            .catch(err => {
                                console.error('Ошибка загрузки внешнего скрипта:', err);
                                showToast('Ошибка загрузки скрипта', 4000);
                            });
                    }, 1500);
                } else {
                    statusElem.textContent = 'Ключ не подтверждён...';
                }
            })
            .catch(err => {
                statusElem.textContent = 'Ошибка проверки ключа';
                console.error('Ошибка проверки ключа:', err);
            });
    }, 2000);

})();
