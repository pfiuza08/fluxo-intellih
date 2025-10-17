const chatBox = document.getElementById("chat-box");
const WEBAPP_URL = (window.__INTELLIH__ || {}).WEBAPP_URL || "";

function delay(ms){ return new Promise(r => setTimeout(r, ms)); }

async function bubble(text, from='bot'){
  const wrap = document.createElement('div');
  wrap.className = 'message' + (from === 'user' ? ' user' : '');
  const avatar = from === 'bot' ? '<div class="avatar"></div>' : '';
  wrap.innerHTML = avatar + `<div class="bubble">${text}</div>`;
  chatBox.appendChild(wrap);
  chatBox.scrollTop = chatBox.scrollHeight;
  await delay(150);
}

function buttons(arr){
  const div = document.createElement('div');
  div.className = 'buttons';
  arr.forEach(({label, onClick})=>{
    const b = document.createElement('button');
    b.textContent = label;
    b.onclick = ()=>{ div.remove(); onClick(); };
    div.appendChild(b);
  });
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function inputField(type='text', placeholder='Digite aqui...'){
  const inp = document.createElement('input');
  inp.type = type;
  inp.placeholder = placeholder;
  chatBox.appendChild(inp);
  chatBox.scrollTop = chatBox.scrollHeight;
  return inp;
}

async function start(){
  await bubble('👋 Oi! Eu sou o assistente da Intellih.');
  await bubble('Quer descobrir como automatizar seu negócio com IA?');
  buttons([
    {label:'Sim, quero!', onClick: fasePerfil},
    {label:'Quero ver exemplos', onClick: faseExemplos}
  ]);
}

async function fasePerfil(){
  await bubble('🚀 Legal! Você é:');
  buttons([
    {label:'Empreendedor(a)', onClick: ()=>faseNome('Empreendedor')},
    {label:'Autônomo(a)', onClick: ()=>faseNome('Autônomo')},
    {label:'Curioso(a) sobre IA', onClick: ()=>faseNome('Curioso')}
  ]);
}

async function faseExemplos(){
  await bubble('👇 Exemplos práticos que implementamos:');
  await bubble('⚙️ Captação automática de leads<br>💬 Atendimento inteligente no WhatsApp<br>📊 Relatórios e análises com IA');
  buttons([{label:'Quero saber qual se encaixa no meu negócio', onClick: ()=>faseNome('Exemplos')}]);
}

async function faseNome(tipo){
  await bubble('✏️ Me diga seu nome para personalizar o diagnóstico:');
  const inp = inputField('text','Seu nome completo');
  buttons([{label:'Próximo', onClick: ()=>faseEmail(tipo, inp.value)}]);
}

async function faseEmail(tipo, nome){
  await bubble(`Perfeito, ${nome}!`);
  await bubble('📧 Agora, seu e-mail:');
  const inp = inputField('email','voce@empresa.com');
  buttons([{label:'Enviar', onClick: ()=>enviar(nome, inp.value, tipo)}]);
}

async function enviar(nome, email, tipo){
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    await bubble('⚠️ E-mail inválido. Tente novamente.');
    return;
  }
  await bubble('⏳ Processando seus dados...');
  try { if(typeof fbq === 'function') fbq('track','Lead'); } catch(e){}
  
  try{
    const res = await fetch(WEBAPP_URL, {
      method:'POST',
      body: JSON.stringify({ nome, email, tipo })
    });
    const data = await res.text();
    if (data.includes('OK')) {
      await bubble(`✅ Obrigado, ${nome}!`);
      await bubble('Você receberá seu diagnóstico gratuito em até 24h.');
    } else {
      await bubble('⚠️ Houve um problema ao enviar. Verifique o Apps Script.');
    }
  }catch(e){
    await bubble('⚠️ Ocorreu um erro ao enviar. Tente novamente mais tarde.');
    console.error(e);
  }
}

start();
