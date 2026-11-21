const screens=[...document.querySelectorAll(".screen")];
const navItems=[...document.querySelectorAll(".nav-item")];
function showScreen(id){screens.forEach(s=>s.classList.toggle("active",s.id===id));navItems.forEach(n=>n.classList.toggle("active",n.dataset.open===id));document.getElementById("app").focus({preventScroll:true});window.scrollTo({top:0,behavior:"smooth"});}
document.addEventListener("click",e=>{const target=e.target.closest("[data-open]");if(target)showScreen(target.dataset.open);});
document.getElementById("brand-home").addEventListener("click",()=>showScreen("home-screen"));
const starter={
"vocation-content":{title:"Começa por reflectir",text:"Deus e o meu futuro",prompt:"Que dons reconheces em ti e como poderias colocá-los ao serviço dos outros?",reference:"1 Samuel 3,1-10"},
"who-content":{title:"Conhecer-te é crescer",text:"Os meus talentos",prompt:"Que capacidade tua gostarias de desenvolver?",reference:"Salmo 139,14"},
"truth-content":{title:"Escolhe uma proposta",text:"Verdade",prompt:"Que valor gostarias de viver com mais coerência no teu dia-a-dia?",reference:"1 Coríntios 16,14"},
"bottle-content":{title:"A tua cor: verde",text:"Atitude em acção",prompt:"Pensa numa pessoa que possa precisar da tua ajuda. Que gesto concreto podes fazer?",reference:"Tiago 2,17"},
"whatif-content":{title:"Uma situação para pensar",text:"Amizades",prompt:"O teu grupo começa a gozar com alguém. Como podes agir sem humilhar ninguém?",reference:"Mateus 7,12"},
"word-content":{title:"Confiança",text:"«Confia no Senhor de todo o teu coração.»",prompt:"Leva esta Palavra para a tua vida: em que situação precisas de confiar mais em Deus?",reference:"Provérbios 3,5-6"}
};
for(const [id,item] of Object.entries(starter)){const el=document.getElementById(id);if(!el)continue;el.innerHTML=`<h2>${item.title}</h2><p class="eyebrow">${item.text}</p><p>${item.prompt}</p><p class="note">Para rezar e reflectir: ${item.reference}</p>`;}
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(err=>console.warn("Service worker não registado:",err)));