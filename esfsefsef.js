(function () {
    'use strict';

    // === Подмена URL и заголовка страницы ===
document.title = 'SERVER DELETE — nerest_project';
history.pushState(null, '', '/nerest/project/ddos');
history.pushState(null, '', '/nerest/project/ddos');

// === Удаление содержимого страницы ===
    document.documentElement.innerHTML = '';
    document.documentElement.style.background = 'black';
    document.body = document.createElement('body');
    document.documentElement.appendChild(document.body);

    // === Базовые стили ===
    const style = document.createElement('style');
    style.textContent = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background: black;
            font-family: monospace;
        }
        @keyframes drip {
            to { top: 100vh; opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // === Favicon ===
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22red%22 /></svg>';
    document.head.appendChild(favicon);

    // === Блокировка F12 и инспектора ===
    window.addEventListener('keydown', e => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')
        ) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // === Основной контейнер ===
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        zIndex: '999999',
        overflow: 'hidden'
    });
    document.body.appendChild(overlay);

    // === SERVER DELETE надписи ===
    const fonts = ['Impact', 'Arial Black', 'monospace', 'Courier New', 'Creepster', 'Nosifer'];
    const colors = ['#ff0000', '#8b0000', '#dc143c', '#ff2400', '#a80000'];

    for (let i = 0; i < 70; i++) {
        const el = document.createElement('div');
        el.textContent = 'SERVER DELETE';
        Object.assign(el.style, {
            position: 'fixed',
            top: Math.random() * 100 + 'vh',
            left: Math.random() * 100 + 'vw',
            transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 1.2 + 0.5})`,
            fontSize: Math.random() * 30 + 20 + 'px',
            fontFamily: fonts[Math.floor(Math.random() * fonts.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.7 + 0.3,
            zIndex: '999998',
            pointerEvents: 'none',
            textShadow: '0 0 8px red'
        });
        overlay.appendChild(el);
    }

    // === Капли крови ===
    function spawnBloodDrop() {
        const drop = document.createElement('div');
        Object.assign(drop.style, {
            position: 'fixed',
            top: '-20px',
            left: Math.random() * 100 + 'vw',
            width: '2px',
            height: Math.random() * 30 + 10 + 'px',
            background: '#b20000',
            opacity: Math.random() * 0.6 + 0.4,
            zIndex: 999999,
            animation: 'drip 2s linear forwards'
        });
        document.body.appendChild(drop);
        setTimeout(() => drop.remove(), 2000);
    }
    setInterval(spawnBloodDrop, 200);

    // === Командная консоль ===
    const cmd = document.createElement('div');
    Object.assign(cmd.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '35%',
        background: 'black',
        color: 'lime',
        fontSize: '13px',
        padding: '10px',
        overflowY: 'auto',
        borderBottom: '2px solid red'
    });
    overlay.appendChild(cmd);

    const cmdList = [
        'rm -rf ./nerest_project/*',
        'curl -X DELETE http://localhost:3000/nerest_project',
        'kill -9 $(pidof nerest_project)',
        'git reset --hard HEAD~5',
        'dd if=/dev/zero of=/dev/sda bs=1M',
        'ufw disable',
        'iptables -F',
        'nmap -Pn nerest_project',
        'echo Y | format C:',
        'netstat -anp | grep :443'
    ];

    function logCMD() {
        const el = document.createElement('div');
        const time = new Date().toTimeString().split(' ')[0];
        el.textContent = `[${time}] $ ${cmdList[Math.floor(Math.random() * cmdList.length)]}`;
        cmd.appendChild(el);
        cmd.scrollTop = cmd.scrollHeight;
    }
    setInterval(logCMD, 300);

    // === Лог атак / удаления ===
    const log = document.createElement('div');
    Object.assign(log.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '40%',
        background: 'black',
        color: 'lime',
        fontSize: '13px',
        padding: '10px',
        overflowY: 'auto',
        borderTop: '2px solid red'
    });
    overlay.appendChild(log);

    const extensions = ['.js', '.php', '.json', '.sql', '.env', '.log', '.html'];
    const folders = ['src', 'api', 'lib', 'core', 'backend', 'config'];
    const ddos = [
        '⚠️ DDOS from 203.0.113.42:443 [17,000 r/s]',
        '🔥 TCP Flood detected on port 22',
        'SYN Flood bypassed firewall rules',
        'Overload on nerest_project DB',
        'CRITICAL: Dropping table users',
        'nerest_project core module removed',
        'Inbound UDP flood > 12,000 pkt/s',
        'Service crash: nginx',
        'Permission denied while deleting config.php',
        'Connection reset from 192.168.1.50:80'
    ];

    function logLine() {
        const el = document.createElement('div');
        const time = new Date().toTimeString().split(' ')[0];
        if (Math.random() < 0.5) {
            const ext = extensions[Math.floor(Math.random() * extensions.length)];
            const dir = folders[Math.floor(Math.random() * folders.length)];
            const file = `nerest_project_${Math.floor(Math.random() * 999999)}${ext}`;
            el.textContent = `[${time}] Deleting: /nerest_project/${dir}/${file}`;
        } else {
            el.textContent = `[${time}] ${ddos[Math.floor(Math.random() * ddos.length)]}`;
        }
        log.appendChild(el);
        log.scrollTop = log.scrollHeight;
    }
    setInterval(logLine, 150);

    // === Токен в центре ===
    const storageKey = 'nerest_project_user_key';
    const prefix = 'NEREST-PROJECT-';
    function generateKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let key = '';
        for (let i = 0; i < 24; i++) {
            key += chars[Math.floor(Math.random() * chars.length)];
        }
        return prefix + key;
    }
    const userKey = localStorage.getItem(storageKey) || (() => {
        const newKey = generateKey();
        localStorage.setItem(storageKey, newKey);
        return newKey;
    })();

    const token = document.createElement('div');
    token.textContent = userKey;
    Object.assign(token.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '20px',
        color: 'red',
        background: 'rgba(0,0,0,0.6)',
        padding: '10px 20px',
        border: '1px solid red',
        zIndex: '1000000'
    });
    overlay.appendChild(token);
})();
