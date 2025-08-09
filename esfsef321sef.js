(function() {
    'use strict';

    const GITHUB_JSON_URL = atob("aHR0cHM6Ly9yYXcuaWdodGh1YnVzZXJjb250ZW50LmNvbS9kYXluNzc3aXBsYXMtZ2F5L2c5Zzg3dGc5MHczZXJ3My9jb2Rlcy5qc29u"); // https://raw.githubusercontent.com/dayn777iplas-gay/g9g87tg90w3erw3/codes.json

    function showBlocker(message, color="#0ff") {
        document.body.innerHTML = "";
        const div = document.createElement("div");
        Object.assign(div.style, {
            position:"fixed", top:"0", left:"0", width:"100%", height:"100%",
            backgroundColor:"#000", color: color, fontFamily:"monospace",
            fontSize:"18px", display:"flex", justifyContent:"center",
            alignItems:"center", textAlign:"center", padding:"20px",
            whiteSpace:"pre-wrap", zIndex:"99999999"
        });
        div.textContent = message;
        document.body.appendChild(div);
        return div;
    }

    function getExternalIP() {
        return new Promise((res, rej) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.ipify.org?format=json",
                onload: r => {
                    try {
                        const ip = JSON.parse(r.responseText).ip;
                        res(ip);
                    } catch { rej("Error parsing IP"); }
                },
                onerror: () => rej("Error getting IP")
            });
        });
    }

    function checkIPInList(ip) {
        return new Promise((res) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: GITHUB_JSON_URL + "?_=" + Date.now(),
                onload: r => {
                    try {
                        const list = JSON.parse(r.responseText);
                        res(list.includes(ip));
                    } catch {
                        res(false);
                    }
                },
                onerror: () => res(false)
            });
        });
    }

    async function main() {
        showBlocker("⚡ NEREST PROJECT ⚡\n\n⏳ Получаем IP...");
        try {
            const ip = await getExternalIP();
            showBlocker(`⚡ NEREST PROJECT ⚡\n\n⏳ Проверяем доступ для:\n\n${ip}`);

            const allowed = await checkIPInList(ip);
            if (allowed) {
                document.body.innerHTML = ""; // чистим экран
                // ======= ВАШ ОСНОВНОЙ КОД СЮДА =======
            } else {
                showBlocker(`⛔ ДОСТУП ЗАПРЕЩЕН\n\nВаш IP:\n${ip}`, "#f00");
            }
        } catch (e) {
            showBlocker("Ошибка при проверке доступа\n\n" + e, "#f00");
        }
    }

    // Заглушаем консоль
    console.log = console.error = console.warn = console.info = () => {};

    main();
})();
