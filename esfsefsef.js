(function () {
    'use strict';

    const clientId = '1400298707819302933';
    const redirectUri = 'https://descrober.github.io/dp0aikfeopjfow/discord-auth.html';
    const apiUrl = 'https://adadadadad-97sj.onrender.com/verify';
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

    // ✅ Отправляем heartbeat
    fetch("https://expected-kara-lynn-anus23323-840ae195.koyeb.app/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            discord_id: userId,
            timestamp: Date.now()
        })
    }).then(res => {
        if (!res.ok) console.error("❌ Heartbeat failed");
    }).catch(err => console.error("❌ Error sending heartbeat:", err));

    // ✅ Загружаем основной скрипт
    const s = document.createElement('script');
    s.src = externalScriptUrl;
    document.body.appendChild(s);

    blocker.remove();

// ⏱ Запускаем цикл проверки доступа
setInterval(async () => {
    try {
        const stillApproved = await verifyAccess(userId);
        if (!stillApproved) {
            // Показываем чёрный экран
const black = document.createElement('div');
Object.assign(black.style, {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'black', color: 'red', zIndex: 99999999,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    fontSize: '24px', fontFamily: 'monospace'
});
black.innerHTML = '⛔ ПОДПИСКА ОТОЗВАНА<br>СКРИПТ ОТКЛЮЧЁН';
document.body.appendChild(black);

// Удаляем все таймеры и интервалы
let id = window.setTimeout(() => {}, 0);
while (id--) {
    clearTimeout(id);
    clearInterval(id);
}

// Удаляем все скрипты
document.querySelectorAll('script').forEach(s => s.remove());

// Очищаем localStorage, чтобы при перезагрузке снова попросило авторизацию
localStorage.removeItem('nerest_discord_id');

// Завершаем выполнение скрипта
throw new Error("Access revoked");
        }
    } catch (err) {
        console.warn("Ошибка при проверке доступа:", err);
    }
}, 10000); // каждые 10 сек
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
    // 🚫 Блокировка F12, Ctrl+Shift+I, Ctrl+U и других
document.addEventListener('keydown', function (e) {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
        e.stopPropagation();
        alert("🚫 Доступ запрещён");
        return false;
    }
});
    run();
})();
