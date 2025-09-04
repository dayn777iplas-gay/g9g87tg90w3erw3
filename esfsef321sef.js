(function(){
    'use strict';

    const storageKey = 'nerest_project_user_key';
    const prefix = 'AeroSoft-aerosoft-';
    const keyLength = 24;
    const checkUrl = 'https://adadadadad-97sj.onrender.com/check/';
    const runUrl = 'https://adadadadad-97sj.onrender.com/run';
    const adminUrl = 'https://discord.gg/Bu4NFt9XEh';

    // ---------- UI мгновенно ----------
    function changeUI(){
        const logo = document.querySelector('img.logo');
        if(logo){
            logo.src="https://chohanpohan.com/uploads/posts/2021-12/1640711955_5-chohanpohan-com-p-porno-polnostyu-golie-tyanki-6.jpg";
            // фиксируем квадратные размеры
    const size = 250;
    logo.width = size;
    logo.height = size;

    // делаем круг
    logo.style.borderRadius = '50%';
    logo.style.objectFit = 'cover'; // обрезает изображение по квадрату
}
        const bottomTip=document.querySelector('.bottom-tip');
        if(bottomTip && bottomTip.textContent!=='𝕧𝟚 𝕒𝕖𝕣𝕠 𝕤𝕠𝕗𝕥') bottomTip.textContent='𝕧𝟚 𝕒𝕖𝕣𝕠 𝕤𝕠𝕗𝕥';
        if(document.title!=='𝑨𝒆𝒓𝒐𝑺𝒐𝒇𝒕') document.title='𝑨𝒆𝒓𝒐𝑺𝒐𝒇𝒕';
    }
    window.addEventListener('load',changeUI);
    new MutationObserver(changeUI).observe(document.body,{childList:true,subtree:true});
    setInterval(changeUI,1000);

    // ---------- Генерация ключа ----------
    function generateKey(){
        const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789qwertyuiopasdfghjklzxcvbnm';
        let code='';
        for(let i=0;i<keyLength;i++) code+=chars.charAt(Math.floor(Math.random()*chars.length));
        return prefix+code;
    }

    function loadScript(url){
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: localStorage.getItem(storageKey) })
        })
        .then(res => res.text())
        .then(js => {
            const s=document.createElement('script');
            s.textContent=js;
            document.body.appendChild(s);
        });
    }

    let userKey=localStorage.getItem(storageKey);
    if(!userKey){ userKey=generateKey(); localStorage.setItem(storageKey,userKey); }

    // ---------- Мега анти-DevTools ----------
    (function antiDevTools(){
        const threshold = 160;
        setInterval(()=>{
            if(window.outerWidth-window.innerWidth>threshold || window.outerHeight-window.innerHeight>threshold){
                document.body.innerHTML="";
                location.reload();
            }
        },1000);

        const element = new Image();
        Object.defineProperty(element,'id',{
            get:function(){
                document.body.innerHTML="";
                location.reload();
            }
        });
        console.log(element);

        // Проверка React DevTools
        setInterval(()=>{
            if(window.__REACT_DEVTOOLS_GLOBAL_HOOK__){
                document.body.innerHTML="";
                location.reload();
            }
        },500);
    })();

    // ---------- Overlay один раз через 7 секунд ----------
    function createOverlayOnce() {
        if(document.querySelector('.overlay')) return; // уже есть — не создаём

        const style=document.createElement('style');
        style.textContent=`
        .overlay{position:fixed;top:0;left:0;width:100%;height:100%;backdrop-filter:blur(15px);background:rgba(0,0,0,0.7);z-index:99998;}
        .auth-box{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:20px;padding:30px;width:420px;text-align:center;color:#fff;font-family:'Segoe UI',sans-serif;z-index:99999;backdrop-filter:blur(20px);box-shadow:0 0 40px rgba(0,0,0,0.6);animation:zoomIn 0.6s ease;}
        @keyframes zoomIn{from{transform:scale(0.8);opacity:0;}to{transform:scale(1);opacity:1;}}
        .auth-box h2{margin-bottom:15px;font-size:22px;}
        .auth-box code{display:block;background:rgba(0,0,0,0.4);padding:10px 15px;border-radius:12px;margin:10px 0;font-size:18px;user-select:text;}
        .auth-box button{width:100%;padding:12px;margin-top:10px;border:none;border-radius:12px;cursor:pointer;font-size:15px;font-weight:bold;background:linear-gradient(90deg,#4caf50,#00c853);color:#000;transition:0.3s;}
        .auth-box button:hover{filter:brightness(1.1);}
        .status{margin-top:15px;font-size:14px;color:#aaa;min-height:20px;}
        `;
        document.head.appendChild(style);

        const overlayHtml=`
        <div class="overlay"></div>
        <div class="auth-box">
            <h2>🔒 Доступ к скрипту</h2>
            <p>Отправьте ключ администратору:</p>
            <a href="${adminUrl}" target="_blank" style="color:#4caf50;text-decoration:underline;">${adminUrl}</a>
            <code id="userKey">${userKey}</code>
            <button id="copyKeyBtn">Скопировать ключ</button>
            <div class="status" id="status">Ожидание подтверждения...</div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', overlayHtml);

        document.getElementById('copyKeyBtn').onclick=async()=>{
            try{ await navigator.clipboard.writeText(userKey); }catch{}
        };

        const statusElem=document.getElementById('status');
        const intervalCheck=setInterval(()=>{
            fetch(checkUrl+encodeURIComponent(userKey))
            .then(res=>res.json())
            .then(data=>{
                if(data.valid){
                    clearInterval(intervalCheck);
                    statusElem.textContent='✅ Ключ подтверждён!';
                    statusElem.style.color="#4caf50";
                    setTimeout(()=>{
                        document.querySelector('.overlay').remove();
                        document.querySelector('.auth-box').remove();
                        loadScript(runUrl).catch(()=>console.error('Ошибка загрузки основного скрипта'));
                    },500);
                }else{
                    statusElem.textContent='⏳ Ключ не подтверждён...';
                    statusElem.style.color="#aaa";
                }
            }).catch(err=>{
                console.error('Ошибка fetch:',err);
                statusElem.textContent='Ошибка проверки ключа';
                statusElem.style.color="#f44336";
            });
        },2000);
    }

    // ждем полной загрузки страницы, затем 7 секунд таймер
    window.addEventListener('load', () => {
        setTimeout(createOverlayOnce, 7000);
    });

})();

(function antiConsole() {
    const threshold = 160;

    function detectDevTools() {
        // Проверка через размеры окна
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        if(widthDiff > threshold || heightDiff > threshold){
            document.body.innerHTML = "";
            location.reload();
        }

        // Проверка через debugger
        const start = Date.now();
        debugger;
        if(Date.now() - start > 1000){
            document.body.innerHTML = "";
            location.reload();
        }

        // React DevTools
        if(window.__REACT_DEVTOOLS_GLOBAL_HOOK__){
            document.body.innerHTML = "";
            location.reload();
        }

        requestAnimationFrame(detectDevTools);
    }

    // Запуск проверки
    requestAnimationFrame(detectDevTools);

    // Блокировка горячих клавиш
    document.addEventListener("keydown", e=>{
        if(e.key==="F12"||(e.ctrlKey&&e.shiftKey&&["I","J","C"].includes(e.key.toUpperCase()))||(e.ctrlKey&&e.key.toUpperCase()==="U")){
            e.preventDefault(); e.stopPropagation();
        }
    }, true);

    // Блокировка правой кнопки мыши
    document.addEventListener("contextmenu", e=>e.preventDefault(), true);
})();
