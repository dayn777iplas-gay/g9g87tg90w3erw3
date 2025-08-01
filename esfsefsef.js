(function () {
    'use strict';

    const clientId = '1400298707819302933';
    const redirectUri = 'https://0d4194eb-8f89-4d36-a2b3-f352d7c641d4-00-25gw8cdz2878f.kirk.replit.dev/';
    const apiUrl = 'https://expected-kara-lynn-anus23323-840ae195.koyeb.app/verify';
    const externalScriptUrl = 'https://descrober.github.io/dp0aikfeopjfow/dadwadfafaf.js';
    const storageKey = 'nerest_discord_id';

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

    const params = new URLSearchParams(window.location.search);
    const urlId = params.get('discord_id');
    if (urlId) {
        localStorage.setItem(storageKey, urlId);
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    async function verifyAccess(userId) {
        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId })
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return data.status === 'approved';
        } catch (err) {
            console.error('Ошибка при обращении к API:', err);
            throw err;
        }
    }

    async function run() {
        const userId = localStorage.getItem(storageKey);

        if (!userId) {
            window.location.href = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=identify`;
            return;
        }

        statusEl.innerHTML = `
            🔍 Проверка Discord ID:<br>
            <code style="font-size: 20px; background: #222; padding: 8px 12px; border-radius: 6px;">${userId}</code>
        `;

        try {
            const approved = await verifyAccess(userId);

            if (approved) {
                statusEl.innerHTML = `✅ Доступ разрешён. Загрузка скрипта...`;
                const s = document.createElement('script');
                s.src = externalScriptUrl;
                document.body.appendChild(s);
                setTimeout(() => blocker.remove(), 1500);
            } else {
                statusEl.innerHTML = `
                    ❌ Ваш Discord ID не имеет доступа<br><br>
                    <code style="font-size: 20px; background: #222; padding: 10px; border-radius: 8px;">${userId}</code><br><br>
                    🛠 Отправьте этот ID администратору для активации.
                `;
            }
        } catch (err) {
            statusEl.innerHTML = `
                ❌ Ошибка подключения к API:<br><br>
                <code style="font-size: 16px; background: #300; padding: 10px; border-radius: 8px;">${err.message}</code><br><br>
                Ваш Discord ID:<br>
                <code style="font-size: 20px; background: #222; padding: 10px; border-radius: 8px;">${userId}</code>
            `;
        }
    }

    run();
})();
