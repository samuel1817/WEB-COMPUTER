(() => {
  const layer=document.getElementById("window-layer"), taskbar=document.getElementById("taskbar-apps");
  let z=20, count=0; const windows=new Map();
  const icons={explorer:"📁",notes:"📝",calculator:"🧮",terminal:"⌘",settings:"⚙️",calendar:"📅",browser:"🌐",about:"💻"};
  function focus(win){z++;win.style.zIndex=z;document.querySelectorAll(".taskbar-app").forEach(b=>b.classList.toggle("active",b.dataset.id===win.dataset.id))}
  function open(id,title,content){
    const existing=[...windows.values()].find(w=>w.dataset.app===id&&!w.classList.contains("minimized"));
    if(existing){focus(existing);return}
    const win=document.createElement("section");win.className="app-window";win.dataset.app=id;win.dataset.id=String(++count);
    win.style.left=Math.max(12,Math.min(innerWidth-670,90+windows.size*28))+"px";win.style.top=Math.max(12,Math.min(innerHeight-500,65+windows.size*24))+"px";
    win.innerHTML=`<header class="window-titlebar"><span class="window-app-icon">${icons[id]||"▣"}</span><span class="window-title">${title}</span><div class="window-controls"><button data-action="min" title="Minimize">—</button><button data-action="max" title="Maximize">□</button><button data-action="close" class="close" title="Close">×</button></div></header><div class="window-content"></div>`;
    win.querySelector(".window-content").append(content);layer.append(win);windows.set(win.dataset.id,win);focus(win);
    const task=document.createElement("button");task.className="taskbar-app active";task.dataset.id=win.dataset.id;task.title=title;task.textContent=icons[id]||"▣";task.addEventListener("click",()=>{if(win.classList.contains("minimized")){win.classList.remove("minimized");win.style.display="flex";focus(win)}else if(+win.style.zIndex===z){win.classList.add("minimized");win.style.display="none";task.classList.remove("active")}else focus(win)});taskbar.append(task);
    win.addEventListener("pointerdown",()=>focus(win));
    win.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();const a=b.dataset.action;if(a==="close"){win.remove();task.remove();windows.delete(win.dataset.id)}if(a==="min"){win.classList.add("minimized");win.style.display="none";task.classList.remove("active")}if(a==="max"){win.classList.toggle("maximized");focus(win)}}));
    const bar=win.querySelector(".window-titlebar");let drag=null;
    bar.addEventListener("pointerdown",e=>{if(e.target.closest(".window-controls")||win.classList.contains("maximized"))return;drag={x:e.clientX-win.offsetLeft,y:e.clientY-win.offsetTop};bar.setPointerCapture(e.pointerId);focus(win)});
    bar.addEventListener("pointermove",e=>{if(!drag)return;win.style.left=Math.max(0,Math.min(innerWidth-win.offsetWidth,e.clientX-drag.x))+"px";win.style.top=Math.max(0,Math.min(innerHeight-100,e.clientY-drag.y))+"px"});
    bar.addEventListener("pointerup",()=>drag=null);bar.addEventListener("pointercancel",()=>drag=null);
    return win.querySelector(".window-content");
  }
  window.WindowManager={open,closeAll(){windows.forEach(w=>w.remove());windows.clear();taskbar.innerHTML=""}};
})();
