(() => {
  const KEY = "web-computer-data-v1";
  const defaults = {theme:"dark",accent:"#60a5fa",wallpaper:"",notes:[{id:1,title:"Welcome",body:"Welcome to WEB COMPUTER!\n\nYour own desktop in the browser."}],files:[{id:1,name:"Documents",type:"folder"},{id:2,name:"Pictures",type:"folder"},{id:3,name:"Welcome.txt",type:"file",content:"Welcome to WEB COMPUTER."}],brightness:100,volume:65};
  let data;
  try { data = {...defaults,...JSON.parse(localStorage.getItem(KEY) || "{}")}; } catch { data = {...defaults}; }
  window.Store = {
    get(key){return data[key]},
    set(key,value){data[key]=value;this.save()},
    save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){console.warn("Storage limit reached",e)}},
    reset(){data={...defaults,notes:[...defaults.notes],files:[...defaults.files]};this.save();location.reload()},
    all(){return data}
  };
})();
