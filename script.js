const chatBox = document.getElementById("chat-box");
const CFG = (window.__INTELLIH__ || {});
const WEBAPP_URL = CFG.WEBAPP_URL || "";
const EBOOK_URL  = CFG.EBOOK_URL  || "";
const SECRET_KEY = CFG.SECRET_KEY || "INTELLIH2025";

const delay = (ms)=>new Promise(r=>setTimeout(r,ms));

async function bubble(text, from='bot'){
  const wrap = document.createElement('div');
  wrap.className = 'message' + (from==='user'?' user':'');
  const avatar = from==='bot'?'<div class="avatar"></div>':'';
  wrap.innerHTML = avatar + `<div class="bubble">${text}</div>`;
  chatBox.appendChild(wrap);
  chatBox.scrollTop = chatBox.scrollHeight;
  await delay(120);
}

function buttons(arr){
  const div=document.createElement('div');
  div.className='buttons';
  arr.forEach(({label,onClick})=>{
    const b=document.createElement('button');
    b.textContent=label;
    b.onclick=()=>{div.remove();onClick();};
    div.appendChild(b);
  });
  chatBox.appendChild(div);
  chatBox.scrollTop=chatBox.scrollHeight;
}

function inputField(type='text',placeholder='Digite aqui...'){
  const inp=document.createElement('input');
  inp.type=type; inp.placeholder=placeholder;
  chatBox.appendChild(inp); chatBox.scrollTop=chatBox.scrollHeight;
  return inp;
}

// fluxo
async function start(){
  await bubble('👋 Oi! Eu sou o assistente da Intellih.');
  await bubble('Quer descobrir como automatizar seu negócio com IA?');
  buttons([
    {label:'Sim, quero!', onClick:()=>{try{fbq('trackCustom','DiagnosticoStart')}catch(e){};fasePerfil();}},
    {label:'Quero ver exemplos', onClick:faseExemplos}
  ]);
}

async function fasePerfil(){
  await bubble('🚀 Legal! Você é:');
  buttons([
    {label:'Empreendedor(a)', onClick:()=>faseNome('Empreendedor')},
    {label:'Autônomo(a)', onClick:()=>faseNome('Autônomo')},
    {label:'Curioso(a) sobre IA', onClick:()=>faseNome('Curioso')}
  ]);
}

async function faseExemplos(){
  await bubble('👇 Exemplos práticos que implementamos:');
  await bubble('⚙️ Captação automática de leads<br>💬 Atendimento inteligente no WhatsApp<br>📊 Relatórios e análises com IA');
  buttons([{label:'Quero saber qual se encaixa no meu negócio', onClick:()=>faseNome('Exemplos')}]);
}

async function faseNome(tipo){
  await bubble('✏️ Me diga seu nome para personalizar o diagnóstico:');
  const inp=inputField('text','Seu nome completo');
  buttons([{label:'Próximo',onClick:()=>faseEmail(tipo,(inp.value||'').trim())}]);
}

async function faseEmail(tipo,nome){
  if(!nome){await bubble('⚠️ Digite seu nome antes de continuar.');return;}
  await bubble(`Perfeito, ${nome}!`);
  await bubble('📧 Agora, seu e-mail:');
  const inp=inputField('email','voce@empresa.com');
  buttons([{label:'Próximo',onClick:()=>faseEbook(tipo,nome,(inp.value||'').trim())}]);
}

async function faseEbook(tipo,nome,email){
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    await bubble('⚠️ E-mail inválido. Tente novamente.');
    return;
  }
  await bubble('📗 Deseja receber também o e-book <b>Automação Inteligente</b>?');
  buttons([
    {label:'Sim, enviar o e-book',onClick:()=>enviar(nome,email,tipo,true)},
    {label:'Agora não',onClick:()=>enviar(nome,email,tipo,false)}
  ]);
}

// envio
async function enviar(nome,email,tipo,ebookOptIn){
  await bubble('⏳ Processando seus dados...');
  try{if(typeof fbq==='function')fbq('track','Lead');}catch(e){}
  try{if(ebookOptIn&&typeof fbq==='function')fbq('trackCustom','EbookOptIn');}catch(e){}

  const params=new URLSearchParams(window.location.search);
  const origem={
    utm_source:params.get("utm_source")||"direto",
    utm_medium:params.get("utm_medium")||"nao_definido",
    utm_campaign:params.get("utm_campaign")||"nao_definido"
  };

  try{
    const res=await fetch(WEBAPP_URL,{
      method:'POST',
      body:JSON.stringify({nome,email,tipo,ebookOptIn,token:SECRET_KEY,...origem})
    });
    const text=await res.text();
    let payload={};try{payload=JSON.parse(text);}catch(_){}
    if(res.ok&&(payload.status==='OK'||text.includes('OK'))){
      await bubble(`✅ Obrigado, ${nome}!`);
      if(ebookOptIn&&EBOOK_URL){
        await bubble('Acabei de te enviar um e-mail com o e-book. Se preferir, baixe por aqui:');
        await bubble(`<a href="${EBOOK_URL}" target="_blank" rel="noopener">📥 Baixar e-book Automação Inteligente</a>`);
      }else{
        await bubble('Você receberá seu diagnóstico gratuito em até 24h.');
      }
    }else{
      console.error('Resposta inesperada:',res.status,text);
      await bubble('⚠️ Houve um problema ao enviar seus dados.');
      if(payload.message)await bubble('Detalhe técnico: '+payload.message);
    }
  }catch(err){
    console.error('Erro de rede/fetch:',err);
    await bubble('⚠️ Ocorreu um erro de comunicação com o servidor.');
  }
}

start();
