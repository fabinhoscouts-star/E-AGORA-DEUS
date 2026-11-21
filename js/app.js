import {vocation,who,truth,bottle,whatif,word} from "./content.js";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const screens=$$(".screen"),navItems=$$(".nav-item");
function showScreen(id){screens.forEach(s=>s.classList.toggle("active",s.id===id));navItems.forEach(n=>n.classList.toggle("active",n.dataset.open===id));window.scrollTo({top:0,behavior:"smooth"});}
document.addEventListener("click",e=>{const b=e.target.closest("[data-open]");if(b)showScreen(b.dataset.open);});
$("#brand-home").addEventListener("click",()=>showScreen("home-screen"));
function panel(id,html){const el=document.getElementById(id);if(el)el.innerHTML=html;}
function actionButtons(nextLabel="Outra proposta"){return `<div class="actions"><button class="secondary" data-action="skip">${nextLabel}</button><button class="quiet" data-action="home">Voltar ao início</button></div>`;}
function renderChoiceGame(target,groups,gameKey){
 let groupIndex=0,itemIndex=0,done=new Set();
 const el=$("#"+target);
 function home(){el.innerHTML=`<h2>Escolhe uma categoria</h2><div class="category-list">${groups.map((g,i)=>`<button class="category-button" data-group="${i}"><strong>${esc(g.name)}</strong><span>${g.items.length} propostas</span></button>`).join("")}</div>${done.size?'<p class="note">Já exploraste algumas propostas. Podes voltar a qualquer categoria.</p>':""}`;}
 function question(){const g=groups[groupIndex],item=g.items[itemIndex];const open=g.kind==="open";el.innerHTML=`<p class="eyebrow">${esc(g.name)} · ${itemIndex+1}/${g.items.length}</p><h2>${esc(item[0])}</h2>${open?`<p>Não há uma resposta certa ou errada. Reserva um momento para pensar.</p><textarea class="reflection" rows="4" placeholder="Se quiseres, escreve aqui a tua reflexão. Não será enviada nem guardada."></textarea>`:`<div class="answer-list">${[item[1],...item[2]].map((v,i)=>`<button class="answer" data-answer="${i}">${esc(v)}</button>`).join("")}</div><div id="feedback" aria-live="polite"></div>`}${open?'<p class="note">A tua reflexão fica apenas nesta página e desaparece quando saíres.</p>':""}<p class="reference">Para aprofundar: ${esc(item[4]||"")}</p><div class="actions"><button class="secondary" data-action="next">Próxima pergunta</button><button class="quiet" data-action="categories">Categorias</button></div>`;}
 el.addEventListener("click",e=>{
  const cat=e.target.closest("[data-group]");if(cat){groupIndex=Number(cat.dataset.group);itemIndex=0;question();return;}
  const ans=e.target.closest("[data-answer]");if(ans){const item=groups[groupIndex].items[itemIndex];const feedback=$("#feedback");if(groups[groupIndex].kind==="choice"){const correct=Number(ans.dataset.answer)===0;feedback.innerHTML=`<div class="feedback"><strong>${correct?"Boa reflexão.":"Pensa também nesta possibilidade."}</strong><p>${esc(item[3])}</p></div>`;el.querySelectorAll(".answer").forEach(b=>b.disabled=true);ans.classList.add("selected");}return;}
  const action=e.target.closest("[data-action]")?.dataset.action;if(action==="next"||action==="skip"){itemIndex++;if(itemIndex>=groups[groupIndex].items.length){done.add(groupIndex);home();}else question();}if(action==="categories")home();if(action==="home")showScreen("home-screen");
 });
 home();
}
renderChoiceGame("vocation-content",vocation,"vocation");
const whoGroups=["Os meus talentos","As minhas qualidades","Os meus valores","As minhas fragilidades"].map(name=>({name,kind:"choice",items:who.filter(q=>q[0]===name).map(q=>[q[1],q[2],[q[3][0],q[3][1]],q[4],q[5]])}));
renderChoiceGame("who-content",whoGroups,"who");
function renderTruth(){
 const el=$("#truth-content");let mode="truth",used={truth:new Set(),dare:new Set()};
 function home(){el.innerHTML=`<h2>Escolhe a modalidade</h2><div class="choice-row"><button class="primary" data-mode="truth">Verdade</button><button class="secondary" data-mode="dare">Consequência</button></div><p class="note">Podes passar a vez. Ninguém é obrigado a responder ou a realizar um desafio. Respeitem os limites de todos.</p>`;}
 function draw(){const list=truth[mode],available=list.map((_,i)=>i).filter(i=>!used[mode].has(i));if(!available.length){el.innerHTML=`<h2>Chegaram ao fim!</h2><p>Já foram usadas todas as propostas desta modalidade.</p><button class="secondary" data-reset="${mode}">Recomeçar modalidade</button><button class="quiet" data-action="home">Modalidades</button>`;return;}const n=available[Math.floor(Math.random()*available.length)];used[mode].add(n);const item=list[n];el.innerHTML=`<p class="eyebrow">${mode==="truth"?"Verdade":"Consequência"} · ${esc(item[0])}</p><h2>${esc(item[1])}</h2><p class="reference">Inspiração: ${esc(item[2])}</p>${actionButtons("Passar a vez / Nova proposta")}`;}
 el.addEventListener("click",e=>{const m=e.target.closest("[data-mode]");if(m){mode=m.dataset.mode;draw();}if(e.target.closest("[data-action=skip]"))draw();if(e.target.closest("[data-action=home]"))home();const r=e.target.closest("[data-reset]");if(r){used[r.dataset.reset].clear();mode=r.dataset.reset;draw();}});home();
}
renderTruth();
function renderBottle(){
 const el=$("#bottle-content");let used=new Set(),busy=false;
 const colours={"Vermelho":"#b94c45","Amarelo":"#d6ad55","Verde":"#43866a","Azul":"#477ca5","Roxo":"#84649b","Laranja":"#d88745"};
 function home(){el.innerHTML=`<p>Escolhe se vais jogar individualmente ou em grupo.</p><div class="choice-row"><button class="primary" data-spin="solo">Individual</button><button class="secondary" data-spin="group">Em grupo</button></div><p class="note">As propostas são sorteadas sem repetição imediata. No modo de grupo, partilhem a vez e respeitem quem preferir passar.</p>`;}
 function draw(){const remaining=bottle.map((_,i)=>i).filter(i=>!used.has(i));if(!remaining.length){el.innerHTML=`<h2>Descobriram todas as propostas!</h2><button class="secondary" data-reset>Jogar novamente</button>`;return;}const index=remaining[Math.floor(Math.random()*remaining.length)];used.add(index);const item=bottle[index];el.innerHTML=`<div class="colour-disc" style="--disc:${colours[item.colour]}">${esc(item.colour)}</div><p class="eyebrow">${esc(item.category)}</p><h2>${esc(item.prompt)}</h2><p class="reference">${esc(item.reference)}</p>${item.category==="Desafia a tua mente"?'<p class="note">Quando todos tiverem respondido, revela a resposta.</p><button class="secondary" data-reveal>Revelar resposta</button><div id="bottle-answer"></div>':""}<div class="actions"><button class="secondary" data-next>Girar novamente</button><button class="quiet" data-action="home">Voltar</button></div>`;}
 el.addEventListener("click",e=>{if(e.target.closest("[data-spin]"))draw();if(e.target.closest("[data-next]"))draw();if(e.target.closest("[data-reset]")){used.clear();home();}if(e.target.closest("[data-action=home]"))home();if(e.target.closest("[data-reveal]"))$("#bottle-answer").innerHTML=`<p class="feedback">${esc(bottle.find(x=>x.prompt===el.querySelector("h2")?.textContent)?.answer||"Confirma a resposta na Bíblia e conversem sobre ela.")}</p>`;});home();
}
renderBottle();
function renderWhatIf(){const el=$("#whatif-content");let used=new Set();function draw(){const remaining=whatif.map((_,i)=>i).filter(i=>!used.has(i));if(!remaining.length){el.innerHTML='<h2>As 15 situações foram exploradas.</h2><button class="secondary" data-reset>Recomeçar</button>';return;}const n=remaining[Math.floor(Math.random()*remaining.length)];used.add(n);const q=whatif[n];el.innerHTML=`<p class="eyebrow">${esc(q[0])} · ${used.size}/15</p><h2>${esc(q[1])}</h2><p class="reference">Para iluminar a reflexão: ${esc(q[2])}</p><p>O que farias? Que consequências poderia ter a tua escolha para ti e para os outros?</p><div class="actions"><button class="secondary" data-next>Outra situação</button><button class="quiet" data-action="home">Voltar ao início</button></div>`;}el.addEventListener("click",e=>{if(e.target.closest("[data-next]"))draw();if(e.target.closest("[data-reset]")){used.clear();draw();}if(e.target.closest("[data-action=home]"))showScreen("home-screen");});draw();}
renderWhatIf();
function renderWord(){const el=$("#word-content");let index=0;function draw(){const w=word[index];el.innerHTML=`<div class="word-tabs">${word.map((x,i)=>`<button class="${i===index?"active":""}" data-word="${i}">${esc(x[0])}</button>`).join("")}</div><p class="eyebrow">Palavra · ${esc(w[1])}</p><blockquote class="scripture">Lê esta passagem na tua Bíblia: ${esc(w[1])}</blockquote><h2>Compreender</h2><p>${esc(w[2])}</p><h2>Levar para a vida</h2><p>${esc(w[3])}</p><h2>Responder</h2><p class="prayer">${esc(w[4])}</p>`;}el.addEventListener("click",e=>{const b=e.target.closest("[data-word]");if(b){index=Number(b.dataset.word);draw();}});draw();}
renderWord();

function renderSeminaristQuestions(){
 const el=$("#questions-content");
 const faqs=[
  {cat:"Vocação e discernimento",q:"O que significa ter uma vocação?",a:"A vocação é um chamamento a viver com sentido e a colocar os dons ao serviço dos outros. Para o cristão, é um caminho de escuta, liberdade, oração e resposta a Deus. Não se limita à vida sacerdotal: cada pessoa é chamada a descobrir como pode amar e servir."},
  {cat:"Vocação e discernimento",q:"Tenho de saber desde já o que Deus quer para a minha vida?",a:"Não. A vocação não se descobre num único dia. É um caminho que exige tempo, oração, autoconhecimento e acompanhamento. Podes começar por reconhecer os teus dons, observar aquilo que dá sentido à tua vida e conversar com alguém de confiança."},
  {cat:"Vocação e discernimento",q:"Ter dúvidas ou medo significa que não tenho vocação?",a:"Não necessariamente. As dúvidas e os receios fazem parte de muitas decisões importantes. O essencial é não deixar que o medo decida por ti: procura conhecer melhor a possibilidade, coloca as perguntas com liberdade e pede acompanhamento."},
  {cat:"Seminário e formação",q:"O que é o Seminário?",a:"O Seminário é uma comunidade e um caminho de formação e discernimento. A formação procura desenvolver, de forma integrada, as dimensões espiritual, humana, intelectual e pastoral. Não é uma garantia automática de ordenação; é um tempo para amadurecer e discernir."},
  {cat:"Seminário e formação",q:"A vida no Seminário é como estar numa prisão?",a:"Não. O Seminário não deve ser entendido como uma fuga do mundo. É um espaço de oração, estudo, convivência, serviço e discernimento, onde se aprende a viver a liberdade com responsabilidade. A vida comunitária também inclui trabalho, amizade, actividades e momentos de convívio."},
  {cat:"Seminário e formação",q:"O que fazem os seminaristas durante o dia?",a:"A rotina habitual inclui oração e celebração da Eucaristia, aulas, estudo pessoal, refeições e tarefas comunitárias. Há também momentos de convívio, actividades formativas e participação pastoral nas paróquias. Os horários podem variar conforme o calendário e as necessidades da comunidade."},
  {cat:"Sacerdócio",q:"Quem é um padre diocesano?",a:"É um homem que, chamado por Deus e ordenado pela Igreja, fica ao serviço de uma diocese, em comunhão com o Bispo. A sua missão inclui anunciar a Palavra, celebrar os sacramentos, acompanhar as pessoas e servir as comunidades."},
  {cat:"Sacerdócio",q:"Quem pode ser padre?",a:"O discernimento sacerdotal exige liberdade, maturidade, condições adequadas e um caminho de formação acompanhado pela Igreja. Não basta simplesmente querer; é necessário conhecer esta vocação, conversar com os responsáveis e percorrer as etapas de discernimento propostas pela diocese."},
  {cat:"Vida pessoal",q:"Gostar de futebol, música, tecnologia ou sair com amigos impede uma vocação sacerdotal?",a:"Não necessariamente. O futuro sacerdote continua a ser uma pessoa com interesses, capacidades, amizades e experiências. A formação ajuda a integrar essas dimensões numa vida de entrega a Deus e ao serviço da Igreja."},
  {cat:"Vida pessoal",q:"Como posso começar a discernir?",a:"Reserva momentos de silêncio e oração, procura conhecer-te melhor, identifica os dons que podes colocar ao serviço dos outros e conversa com alguém que te possa acompanhar. Se quiseres conhecer a possibilidade da vocação sacerdotal, podes procurar o Seminário e pedir uma conversa."}
 ];
 let search="",category="Todas",draft="",showDraft=false;
 const cats=["Todas",...new Set(faqs.map(x=>x.cat))];
 function draw(){
  const filtered=faqs.filter(x=>(category==="Todas"||x.cat===category)&&(!search|| (x.q+" "+x.a+" "+x.cat).toLocaleLowerCase("pt").includes(search.toLocaleLowerCase("pt"))));
  el.innerHTML=`
   <div class="questions-hero"><div><p class="eyebrow">Estamos disponíveis para escutar</p><h2>Não tenhas receio de perguntar.</h2><p>Uma dúvida pode ser o primeiro passo para conheceres melhor a tua fé, a tua vida e o caminho que tens pela frente.</p></div><div class="question-symbol" aria-hidden="true">?</div></div>
   <h2>Perguntas frequentes</h2><p class="muted-copy">Escolhe um tema e abre a pergunta. A resposta só aparece quando carregares nela.</p>
   <label class="field-label" for="faq-search">Procurar uma pergunta</label><input id="faq-search" class="text-field" type="search" placeholder="Escreve uma palavra..." value="${esc(search)}">
   <div class="faq-filters">${cats.map(c=>`<button class="filter-chip ${category===c?"active":""}" data-faq-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
   <div class="faq-list">${filtered.length?filtered.map((f,i)=>`<details class="faq-item"><summary><span class="faq-category">${esc(f.cat)}</span><strong>${esc(f.q)}</strong><span class="faq-plus" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${esc(f.a)}</p><p class="answer-signature">Equipa do Seminário São José · Resposta informativa</p></div></details>`).join(""):'<p class="empty-state">Não encontrámos essa pergunta. Podes preparar a tua própria dúvida mais abaixo.</p>'}</div>
   <div class="ask-card"><p class="eyebrow">A tua pergunta</p><h2>Não encontraste o que procuravas?</h2><p>Escreve a tua pergunta. Podes escolher um tema e preparar o texto para o enviares quando o canal de mensagens estiver disponível.</p>
    <form id="question-draft-form"><label class="field-label" for="question-topic">Sobre o que gostarias de perguntar?</label><select id="question-topic" class="text-field"><option>Vocação e discernimento</option><option>Vida no Seminário</option><option>Formação</option><option>Sacerdócio</option><option>Fé e oração</option><option>Outra questão</option></select>
    <label class="field-label" for="question-draft">A tua pergunta</label><textarea id="question-draft" class="text-field" rows="5" maxlength="1200" placeholder="Escreve aqui a tua dúvida..." required>${esc(draft)}</textarea>
    <div class="draft-meta"><span>Não precisas de indicar o teu nome.</span><span id="draft-count">${draft.length}/1200</span></div>
    <button class="primary" type="submit">Preparar a minha pergunta</button></form>
    <div id="draft-result" aria-live="polite">${showDraft?'<div class="notice"><strong>Rascunho preparado.</strong><p>A pergunta continua apenas nesta página. Ainda não foi enviada nem recebida pelo Seminário.</p></div>':""}</div>
   </div>
   <div class="notice safety-note"><strong>Importante:</strong> nesta versão, as perguntas escritas não são enviadas nem guardadas. O envio e a publicação de respostas só serão activados depois de configurarmos um canal seguro e a equipa do Seminário poder rever as respostas. Não incluas dados pessoais sensíveis nem uses este espaço para situações urgentes.</div>
   <div class="link-actions"><a class="secondary-link" href="https://share.google/OAXVew2J3jZBSjCwx" target="_blank" rel="noopener noreferrer">Página do Seminário ↗</a><a class="secondary-link" href="https://www.facebook.com/p/Semin%C3%A1rio-Diocesano-de-S-Jos%C3%A9-Praia-CV-100064686595926/" target="_blank" rel="noopener noreferrer">Facebook ↗</a></div>`;
  const input=$("#faq-search");input.addEventListener("input",e=>{search=e.target.value;const pos=e.target.selectionStart;draw();const next=$("#faq-search");next.focus();next.setSelectionRange(pos,pos);});
  el.querySelectorAll("[data-faq-cat]").forEach(b=>b.addEventListener("click",()=>{category=b.dataset.faqCat;draw();}));
  const ta=$("#question-draft");ta.addEventListener("input",e=>{draft=e.target.value;$("#draft-count").textContent=draft.length+"/1200";});
  $("#question-draft-form").addEventListener("submit",e=>{e.preventDefault();draft=ta.value.trim();if(!draft)return;showDraft=true;draw();$("#draft-result")?.scrollIntoView({behavior:"smooth",block:"nearest"});});
 }
 draw();
}
renderSeminaristQuestions();

if("serviceWorker"in navigator&&location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(err=>console.warn("Service worker não registado:",err)));
