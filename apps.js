(() => {
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
 const button=(text,fn)=>{const b=el("button","action",text);b.addEventListener("click",fn);return b};
 function openApp(id){
  if(id==="explorer")return explorer();
  if(id==="notes")return notes();
  if(id==="calculator")return calculator();
  if(id==="terminal")return terminal();
  if(id==="settings")return settings();
  if(id==="calendar")return calendar();
  if(id==="browser")return browser();
  if(id==="about")return about();
 }
 function explorer(){
  const c=WindowManager.open("explorer","File Explorer",el("div"));
  const toolbar=el("div","file-toolbar");const grid=el("div","file-grid");c.append(el("h2","","Home"),toolbar,grid);
  const refresh=()=>{grid.innerHTML="";Store.get("files").forEach(f=>{const item=el("button","file-item");item.append(el("span","",f.type==="folder"?"📁":"📄"),el("span","",f.name));item.onclick=()=>{if(f.type==="file")alert(f.content||"Empty file")};grid.append(item)})};
  toolbar.append(button("＋ New folder",()=>{const name=prompt("Folder name:");if(name){const a=Store.get("files");a.push({id:Date.now(),name,type:"folder"});Store.set("files",a);refresh()}}),button("＋ New text file",()=>{const name=prompt("File name:","New file.txt");if(name){const a=Store.get("files");a.push({id:Date.now(),name,type:"file",content:""});Store.set("files",a);refresh()}}),button("↻ Refresh",refresh));refresh();
 }
 function notes(){
  const c=WindowManager.open("notes","Notes",el("div"));const list=el("div","note-list"),title=el("input");title.placeholder="Note title";title.style.width="100%";title.style.marginBottom="9px";const body=el("textarea");body.placeholder="Start writing...";const save=button("Save note",()=>{let arr=Store.get("notes");let n=arr.find(x=>x.id===active);if(n){n.title=title.value;n.body=body.value}else arr.push({id:active,title:title.value||"Untitled",body:body.value});Store.set("notes",arr);render();notify("Note saved")});let active=null;
  function render(){list.innerHTML="";Store.get("notes").forEach(n=>{const b=el("button","",n.title);b.onclick=()=>{active=n.id;title.value=n.title;body.value=n.body};list.append(b)})}
  const fresh=button("＋ New note",()=>{active=Date.now();title.value="";body.value=""});c.append(el("h2","","Notes"),list,fresh,title,body,save);const first=Store.get("notes")[0];if(first){active=first.id;title.value=first.title;body.value=first.body}render();
 }
 function calculator(){
  const c=WindowManager.open("calculator","Calculator",el("div","calc"));const display=el("input","calc-display");display.value="0";display.readOnly=true;const grid=el("div","calc-grid");
  ["C","⌫","%","÷","7","8","9","×","4","5","6","−","1","2","3","+","±","0",".","="].forEach(k=>{const b=el("button","",k);b.onclick=()=>{if(k==="C")display.value="0";else if(k==="⌫")display.value=display.value.slice(0,-1)||"0";else if(k==="="){try{const exp=display.value.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-");if(!/^[0-9+\-*/%.() ]+$/.test(exp))throw 0;const result=Function('"use strict";return ('+exp+')')();display.value=Number.isFinite(result)?String(result):"Error"}catch{display.value="Error"}}else if(k==="±")display.value=String(-Number(display.value));else display.value=display.value==="0"||display.value==="Error"?k:display.value+k};grid.append(b)});c.append(display,grid);
 }
 function terminal(){
  const box=el("div","terminal"),out=el("div","terminal-output"),row=el("div","terminal-input"),prompt=el("span","","user@webcomputer:~$"),input=el("input");input.autocomplete="off";row.append(prompt,input);box.append(out,row);WindowManager.open("terminal","Terminal",box);
  const write=t=>{out.textContent+=t+"\n";out.scrollTop=out.scrollHeight};write("WEB COMPUTER Terminal v1.0\nType 'help' to see available commands.");
  input.addEventListener("keydown",e=>{if(e.key!=="Enter")return;const cmd=input.value.trim();write("user@webcomputer:~$ "+cmd);input.value="";const [c,...args]=cmd.split(" ");switch(c){case"help":write("help, date, time, apps, clear, whoami, echo, reboot");break;case"date":write(new Date().toLocaleDateString());break;case"time":write(new Date().toLocaleTimeString());break;case"whoami":write("Local User");break;case"apps":write("File Explorer, Notes, Calculator, Terminal, Settings, Calendar, Browser");break;case"echo":write(args.join(" "));break;case"clear":out.textContent="";break;case"reboot":location.reload();break;case"":break;default:write("Command not found: "+c)}});setTimeout(()=>input.focus(),50);
 }
 function settings(){
  const c=WindowManager.open("settings","Settings",el("div"));c.append(el("h2","","Settings"));const layout=el("div","settings-layout"),nav=el("div","settings-nav"),panel=el("div");layout.append(nav,panel);c.append(layout);
  const pages={Personalization:()=>{panel.innerHTML="";panel.append(el("h3","","Personalization"));panel.append(el("p","","Accent color"));["#60a5fa","#a78bfa","#34d399","#fb7185","#fbbf24"].forEach(color=>{const b=el("button","action","●");b.style.color=color;b.onclick=()=>{document.documentElement.style.setProperty("--accent",color);Store.set("accent",color)};panel.append(b)});panel.append(el("p","","Wallpaper"));const wall=el("button","action","Default wallpaper");wall.onclick=()=>{document.querySelector(".desktop").style.backgroundImage="";Store.set("wallpaper","")};panel.append(wall);const upload=el("input");upload.type="file";upload.accept="image/*";upload.onchange=()=>{const f=upload.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{document.querySelector(".desktop").style.backgroundImage=`url(${r.result})`;Store.set("wallpaper",r.result)};r.readAsDataURL(f)};panel.append(el("p","","Choose your own wallpaper"),upload)},
   System:()=>{panel.innerHTML="";panel.append(el("h3","","System"));panel.append(el("p","","WEB COMPUTER 1.0 – Browser-based desktop environment."),button("Restart system",()=>location.reload()),button("Reset all local data",()=>{if(confirm("Delete all WEB COMPUTER data?"))Store.reset()}))},
   About:()=>{panel.innerHTML="";panel.append(el("h3","","About"));panel.append(el("p","","WEB COMPUTER is a local web-based desktop experience. It does not replace a real operating system."))}
  };
  Object.keys(pages).forEach((name,i)=>{const b=el("button",i===0?"selected":"",name);b.onclick=()=>{nav.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");pages[name]()};nav.append(b)});pages.Personalization();
 }
 function calendar(){const c=WindowManager.open("calendar","Calendar",el("div"));c.append(el("h2","","Calendar"),el("p","",new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})),el("p","","Your calendar is ready. Events and reminders can be added in a future update."))}
 function browser(){const c=WindowManager.open("browser","Web Browser",el("div"));const p=el("p","","For security, external websites open in a new browser tab.");const input=el("input");input.placeholder="Enter a website address";input.style.width="75%";const go=button("Go",()=>{let u=input.value.trim();if(!/^https?:\/\//i.test(u))u="https://"+u;try{const url=new URL(u);if(["http:","https:"].includes(url.protocol))window.open(url.href,"_blank","noopener")}catch{notify("Invalid address")}});c.append(el("h2","","Web Browser"),p,input,go)}
 function about(){const c=WindowManager.open("about","About WEB COMPUTER",el("div"));c.append(el("h2","","WEB COMPUTER"),el("p","","Version 1.0"),el("p","","Your computer. Your world."),el("p","","Built with HTML, CSS and JavaScript for GitHub Pages."))}
 window.Apps={open:openApp};
})();
