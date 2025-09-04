"use strict";


window.autoEKey = " ";
window.useRightClick = false;
window.fpsControl = true;
window.cpsControl = true;
window.boostPack = true;

let ePerSecond = 50;
let gameState = window.gameState || { player: { energy: 0, level: 1, experience: 0 }, events: [], environment: { weather: "sunny", time: "day" } };


(function() {
    let fpsDiv = document.createElement("div");
    let cpsDiv = document.createElement("div");
    fpsDiv.style.cssText = "position:fixed; top:10px; left:10px; color:white; background:rgba(0,0,0,0.5); padding:5px; z-index:9999;";
    cpsDiv.style.cssText = "position:fixed; top:10px; left:90px; color:white; background:rgba(0,0,0,0.5); padding:5px; z-index:9999;";
    document.body.appendChild(fpsDiv);
    document.body.appendChild(cpsDiv);

    let fpsCount = 0, cpsCount = 0, lastTime = performance.now();

    function fpsLoop() {
        requestAnimationFrame(fpsLoop);
        fpsCount++;
    }
    function updateFPS() {
        let now = performance.now();
        if (window.fpsControl) fpsDiv.textContent = "ᶠᴾᔆ: " + Math.round(fpsCount / ((now - lastTime) / 1000));
        fpsCount = 0;
        lastTime = now;
        setTimeout(updateFPS, 1000);
    }
    document.addEventListener("click", () => { cpsCount++; });
    function updateCPS() {
        if (window.cpsControl) cpsDiv.textContent = "ᶜᴾᔆ: " + cpsCount;
        cpsCount = 0;
        setTimeout(updateCPS, 500);
    }
    fpsLoop();
    updateFPS();
    updateCPS();
})();


(function() {
    let helloDiv = document.createElement("div");
    helloDiv.textContent = "𝑵𝑬𝑹𝑬𝑺𝑻 𝑷𝑹𝑶𝑮𝑬𝑪𝑻";
    helloDiv.style.cssText = "position:fixed; top:15%; left:50%; transform:translate(-50%, -50%); font-size:24px; font-weight:bold; text-shadow:2px 2px 10px rgba(0,0,0,0.8); z-index:9999;";
    document.body.appendChild(helloDiv);

    let colors = ["#FF0000","#0000FF","#00FFFF","#800080","#FFA500","#FFC0CB"];
    setInterval(() => {
        helloDiv.style.color = colors[Math.floor(Math.random() * colors.length)];
    }, 1000);
})();


(function() {
    let running = false;
    function pressE() {
        let eventDown = new KeyboardEvent("keydown", { key:"e", code:"KeyE", keyCode:69, bubbles:true });
        let eventUp = new KeyboardEvent("keyup", { key:"e", code:"KeyE", keyCode:69, bubbles:true });
        window.dispatchEvent(eventDown);
        window.dispatchEvent(eventUp);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === window.autoEKey && !running) {
            running = true;
            document.querySelector(".status_text")?.remove();
            let statusDiv = document.createElement("div");
            statusDiv.className = "status_text";
            statusDiv.textContent = "Rᴜɴɴɪɴɢ";
            statusDiv.style.cssText = "position:fixed; top:10%; left:50%; transform:translate(-50%,-50%); color:white; font-size:20px; z-index:9999;";
            document.body.appendChild(statusDiv);

            window.autoEInterval = setInterval(() => {
                for (let i = 0; i < ePerSecond; i++) pressE();
            }, 50);
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === window.autoEKey && running) {
            running = false;
            clearInterval(window.autoEInterval);
            document.querySelector(".status_text").textContent = "N̶o̶t̶ R̶u̶n̶n̶i̶n̶g̶";
        }
    });
})();


setInterval(() => {
    gameState.player.energy = ePerSecond;
    gameState.player.level += 1;
    gameState.player.experience += 100;
    gameState.environment.weather = "rainy";
    gameState.environment.time = "night";
}, 1000);

(function() {
    'use strict';

    console.log("⚡ True SpeedHack загружен!");


    const header = document.createElement("div");
    header.innerText = "⚡ 𝑯𝒂𝒄𝒌 𝑷𝒂𝒄𝒌 𝑺𝑬𝑹𝑽𝑬𝑹 𝑨𝑹𝑰𝒁𝑶𝑵𝑬";
    Object.assign(header.style, {
        position: "fixed",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "18px",
        fontWeight: "bold",
        color: "#00ffcc",
        textShadow: "0 0 5px #000",
        zIndex: 9999
    });
    document.body.appendChild(header);


    const SPEED_MULTIPLIER = 38.2;
    let origNow = performance.now.bind(performance);
    let origDateNow = Date.now.bind(Date);

    let speedActive = false;

    function enableSpeed() {
        if (speedActive) return;
        speedActive = true;

        performance.now = function() {
            return origNow() * SPEED_MULTIPLIER;
        };
        Date.now = function() {
            return origDateNow() * SPEED_MULTIPLIER;
        };

        console.log("⚡ SpeedHack ВКЛ");
    }

    function disableSpeed() {
        if (!speedActive) return;
        speedActive = false;

        performance.now = origNow;
        Date.now = origDateNow;

        console.log("⚡ SpeedHack ВЫКЛ");
    }


    document.addEventListener("keydown", e => {
        if (e.key === " " && !speedActive) {
            enableSpeed();
        }
    });

    document.addEventListener("keyup", e => {
        if (e.key === " ") {
            disableSpeed();
        }
    });
})();
