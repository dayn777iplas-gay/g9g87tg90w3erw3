(function () {
    'use strict';

    const clientId = '1400298707819302933';
    const redirectUri = 'https://descrober.github.io/dp0aikfeopjfow/discord-auth.html';
    const apiUrl = 'https://expected-kara-lynn-anus23323-840ae195.koyeb.app/verify';
    const externalScriptUrl = 'https://descrober.github.io/dp0aikfeopjfow/dadwadfafaf.js';
    const storageKey = 'nerest_discord_username';

    const blocker = document.createElement('div');
    Object.assign(blocker.style, {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: '#000', color: 'white', fontFamily: 'monospace',
        fontSize: '18px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', zIndex: 9999999, textAlign: 'center',
        padding: '30px'
    });

    blocker.innerHTML = `
        <div style="font-size: 30px; font-weight: bold; color: #0ff; margin-bottom: 20px;">
            ⚡ NEREST PROJECT ⚡
        </div>
        ⏳ Проверка авторизации...
        <div id="status" style="margin-top: 20px;"></div>
        <div style="position: absolute; bottom: 20px; font-size: 14px;">
            🔗 <a href="https://guns.lol/mr.negotiv" target="_blank" style="color: #0ff;">guns.lol/mr.negotiv</a>
        </div>
    `;

    document.body.appendChild(blocker);
    const statusEl = blocker.querySelector('#status');

    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const token = hashParams.get('access_token');

    if (token) {
        getUsernameFromToken(token).then(username => {
            localStorage.setItem(storageKey, username);
            window.history.replaceState({}, document.title, window.location.pathname); // очищаем URL без перезагрузки
            run(); // сразу запускаем
        }).catch(err => {
            statusEl.innerHTML = `❌ Ошибка при получении ника:<br><code>${err.message}</code>`;
        });
    } else {
        run();
    }

    async function getUsernameFromToken(token) {
        const res = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error(`Discord API: ${res.status}`);
        const user = await res.json();
        return user.global_name || `${user.username}#${user.discriminator}`;
    }

    async function verifyAccess(username) {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        if (!res.ok) throw new Error(`API: ${res.status}`);
        const data = await res.json();
        return data.status === 'approved';
    }

    async function run() {
        const username = localStorage.getItem(storageKey);

        if (!username) {
            const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=identify`;
            window.location.href = authUrl;
            return;
        }

        statusEl.innerHTML = `
            🔍 Проверка Discord ника:<br>
            <code style="font-size: 20px; background: #222; padding: 8px 12px; border-radius: 6px;">${username}</code>
        `;

        try {
            const approved = await verifyAccess(username);
            if (approved) {
                statusEl.innerHTML = `✅ Доступ разрешён. Загрузка скрипта...`;
                const s = document.createElement('script');
                s.src = externalScriptUrl;
                document.body.appendChild(s);
                setTimeout(() => blocker.remove(), 1500);
            } else {
                statusEl.innerHTML = `
                    ❌ Вам отказано в доступе<br><br>
                    <code style="font-size: 20px; background: #222; padding: 10px; border-radius: 8px;">${username}</code><br><br>
                    🛠 Отправьте этот ник администратору.
                `;
            }
        } catch (err) {
            statusEl.innerHTML = `
                ❌ Ошибка API:<br><br>
                <code style="font-size: 16px; background: #300; padding: 10px; border-radius: 8px;">${err.message}</code><br><br>
                Discord ник:<br>
                <code style="font-size: 20px; background: #222; padding: 10px; border-radius: 8px;">${username}</code>
            `;
        }
    }
})();
