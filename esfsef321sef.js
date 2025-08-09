(function () {
    'use strict';

    const storageKey = 'nerest_project_token';
    const encodedUrl = atob('aHR0cHM6Ly9kYXluNzc3aXBsYXMtZ2F5LmdpdGh1Yi5pby9nOWc4N3RnOTB3M2VydzMvY29kZXMuanNvbg=='); // codes.json
    const externalScriptUrl = atob('aHR0cHM6Ly9kZXNjcm9iZXIuZ2l0aHViLmlvL2RwMGFpa2Zlb3BqZm93L2RhZHdhZGZhZmFmLmpz'); // твой основной скрипт

    function generateToken() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let token = "NEREST-PROJECT-";
        for (let i = 0; i < 28; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        token += "-";
        return token;
    }

    function getToken() {
        let token = localStorage.getItem(storageKey);
        if (!token) {
            token = generateToken();
            localStorage.setItem(storageKey, token);
        }
        return token;
    }

    function showBlocker(html) {
        document.body.innerHTML = "";
        const blocker = document.createElement('div');
        Object.assign(blocker.style, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: '#000', color: 'white', fontFamily: 'monospace',
            fontSize: '18px', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', zIndex: 9999999, textAlign: 'center',
            padding: '30px'
        });
        blocker.innerHTML = html;
        document.body.appendChild(blocker);
        return blocker;
    }

    async function verifyToken(token) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: encodedUrl + "?_=" + Date.now(),
                onload: function (res) {
                    try {
                        const list = JSON.parse(res.responseText);
                        resolve(list.includes(token));
                    } catch {
                        resolve(false);
                    }
                },
                onerror: function () {
                    resolve(false);
                }
            });
        });
    }

    async function run() {
        const token = getToken();

        const blocker = showBlocker(`
            <div style="font-size: 30px; font-weight: bold; color: #0ff; margin-bottom: 20px;">
                ⚡ NEREST PROJECT ⚡
            </div>
            ⏳ Проверка билда...
            <div id="status" style="margin-top: 20px;"></div>
            <div style="position: absolute; bottom: 20px; font-size: 14px; color: #0ff;">
                Build ID:<br>
                <code style="font-size: 20px; background: #222; padding: 8px 12px; border-radius: 6px;">${token}</code>
            </div>
        `);

        const statusEl = blocker.querySelector('#status');

        const approved = await verifyToken(token);

        if (approved) {
            statusEl.innerHTML = `✅ Доступ разрешён. Загрузка скрипта...`;

            const s = document.createElement('script');
            s.src = externalScriptUrl;
            document.body.appendChild(s);

            blocker.remove();

            // периодическая проверка
            setInterval(async () => {
                const stillApproved = await verifyToken(token);
                if (!stillApproved) {
                    showBlocker(`<div style="color:red;font-size:24px;">⛔ ПОДПИСКА ОТОЗВАНА<br>СКРИПТ ОТКЛЮЧЁН</div>`);
                    localStorage.removeItem(storageKey);
                    throw new Error("Access revoked");
                }
            }, 10000);

        } else {
            statusEl.innerHTML = `
                ❌ Ваш билд не активирован<br><br>
                Отправьте этот Build ID администратору.
            `;
        }
    }

    // отключаем console.*
    console.log = console.error = console.warn = console.info = function(){};

    run();
})();
