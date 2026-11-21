(() => {
 const $=id=>document.getElementById(id);
 window.notify=(message)=>{const n=$("notification");n.textContent=message;n.classList.add("show");clearTimeout(window._notifyTimer);window._notifyTimer=setTimeout(()=>n.classList.remove("show"),2600)};
 const apps=[["explorer","📁","File Explorer"],["notes","📝","Notes"],["calculator","🧮","Calculator"],["terminal","⌘","Terminal"],["settings","⚙️","Settings"],["calendar","📅","Calendar"],["browser","🌐","Browser"],["about","💻","About"]];
 function open(id){$("start-menu").classList.add("hidden");$("quick-panel").classList.add("hidden");Apps.open(id)}
 document.querySelectorAll("[data-app]").forEach(b=>b.addEventListener("click",()=>open(b.dataset.app)));
 $("start-button").onclick=()=>{$("quick-panel").classList.add("hidden");$("start-menu").classList.toggle("hidden");$("app-search").focus()};
 $("quick-button").onclick=()=>{$("start-menu").classList.add("hidden");$("quick-panel").classList.toggle("hidden")};
 $("search-button").onclick=()=>{$("start-menu").classList.remove("hidden");$("app-search").focus()};
 $("clock-button").onclick=()=>{$("quick-panel").classList.toggle("hidden");$("start-menu").classList.add("hidden")};
 $("power-button").onclick=()=>{if(confirm("Shut down WEB COMPUTER?"))location.reload()};
 $("pinned-apps").innerHTML=apps.map(([id,icon,name])=>`<button class="pinned-app" data-launch="${id}"><span class="app-icon">${icon}</span><span>${name}</span></button>`).join("");
 $("pinned-apps").querySelectorAll("[data-launch]").forEach(b=>b.onclick=()=>open(b.dataset.launch));
 $("app-search").addEventListener("input",e=>{const q=e.target.value.toLowerCase();$("pinned-apps").querySelectorAll(".pinned-app").forEach(b=>b.style.display=b.textContent.toLowerCase().includes(q)?"flex":"none")});
 document.querySelectorAll("[data-toggle]").forEach(b=>b.onclick=()=>b.classList.toggle("active"));
 $("brightness").value=Store.get("brightness")||100;$("brightness").oninput=e=>{document.querySelector(".desktop").style.filter=`brightness(${e.target.value/100})`;Store.set("brightness",+e.target.value)};
 $("volume").value=Store.get("volume")||65;$("volume").oninput=e=>Store.set("volume",+e.target.value);
 const accent=Store.get("accent");if(accent)document.documentElement.style.setProperty("--accent",accent);
 const wallpaper=Store.get("wallpaper");if(wallpaper)document.querySelector(".desktop").style.backgroundImage=`url(${wallpaper})`;
 function tick(){const now=new Date();$("clock").textContent=now.toLocaleTimeString("sk-SK",{hour:"2-digit",minute:"2-digit"});$("date").textContent=now.toLocaleDateString("sk-SK");$("quick-date").textContent=now.toLocaleDateString("sk-SK",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
 tick();setInterval(tick,1000);
 setTimeout(()=>{$("boot-status").textContent="Loading desktop..."},500);
 setTimeout(()=>{$("boot-screen").classList.add("hidden");$("desktop").classList.remove("hidden");notify("Welcome to WEB COMPUTER")},2100);
 if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
})();
