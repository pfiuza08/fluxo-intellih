const chatBox = document.getElementById("chat-box");
const WEBAPP_URL = (window.__INTELLIH__ || {}).WEBAPP_URL || "";

// Pequeno atraso entre mensagens
function delay(ms){ return new Promise(r => setTimeout(r, ms)); }

// Cria bolhas de conversa
async function bubble(text, from='bot'){
  const wrap = document.createElement('div');
  wrap.className = 'message' + (from === 'user' ? ' user' : '');
  const avatar = from === 'bot' ? '<div class="avatar"></div>' : '';
  wrap.innerHTML = avatar + `<div class="bubble">${text}</div>`;
  chatBox.appendChild(wrap);
  chatBox.scrollTop = chatBox.scrollHeight;
  await delay(150);
}

// Cria botões de escolha
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

// Cria campo de input
function inputField(type='text', placeholder='Digite aqui...'){
  const inp = document.createElement('input');
  inp.type = type;
  inp.placeholder = placeholder;
  chatBox.appendChild(inp);
  chatBox.scrollTop = chatBox.scrollHeight;
  return inp;
}

// Início do fluxo
async function start(){
  await bubble('👋 Oi! Eu sou o assistente da Intellih.');
  await bubble('Quer descobrir como automatizar seu negócio com IA?');
  buttons([
    {label:'Sim, quero!', onClick: fasePerfil},
    {label:'Quero ver exemplos', onClick: faseExemplos}
  ]);
}

// Etapa 1: pergunta o perfil
async function fasePerfil(){
  await bubble('🚀 Legal! Você é:');
  buttons([
    {label:'Empreendedor(a)', onClick: ()=>faseNome('Empreendedor')},
    {label:'Autônomo(a)', onClick: ()=>faseNome('Autônomo')},
    {label:'Curioso(a) sobre IA', onClick: ()=>faseNome('Curioso')}
  ]);
}

// Etapa 2: mostra exemplos
async function faseExemplos(){
  await bubble('👇 Exemplos práticos que implementamos:');
  await bubble('⚙️ Captação automática de leads<br>💬 Atendimento inteligente no WhatsApp<br>📊 Relatórios e análises com IA');
  buttons([{label:'Quero saber qual se encaixa no meu negócio', onClick: ()=>faseNome('Exemplos')}]);
}

// Etapa 3: coleta nome
async function faseNome(tipo){
  await bubble('✏️ Me diga seu nome para personalizar o diagnóstico:');
  const inp = inputField('text','Seu nome completo');
  buttons([{label:'Próximo', onClick: ()=>faseEmail(tipo, inp.value)}]);
}

// Etapa 4: coleta email
async function faseEmail(tipo, nome){
  await bubble(`Perfeito, ${nome}!`);
  await bubble('📧 Agora, seu e-mail:');
  const inp = inputField('email','voce@empresa.com');
  buttons([{label:'Enviar', onClick: ()=>enviar(nome, inp.value, tipo)}]);
}

// Etapa 5: envia os dados
async function enviar(nome, email, tipo){
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    await bubble('⚠️ E-mail inválido. Tente novamente.');
    return;
  }
  await bubble('⏳ Processando seus dados...');

  // Dispara evento do Pixel
  try { if (typeof fbq === 'function') fbq('track','Lead'); } catch(e) {}

  try {
    const res = await fetch(WEBAPP_URL, {
      method: 'POST',
      body: JSON.stringify({ nome, email, tipo })
    });

    const text = await res.text();
    let payload = {};
    try { payload = JSON.parse(text); } catch(_){}

    if (res.ok && (payload.status === 'OK' || text.includes('OK'))) {
      await bubble(`✅ Obrigado, ${nome}!`);
      await bubble('Você receberá seu diagnóstico gratuito em até 24h.');
    } else {
      console.error('Resposta inesperada:', res.status, text);
      await bubble('⚠️ Houve um problema ao enviar seus dados.');
      if (payload.message) await bubble('Detalhe técnico: ' + payload.message);
    }

  } catch (err) {
    console.error('Erro de rede/fetch:', err);
    await bubble('⚠️ Ocorreu um erro de comunicação com o servidor.');
    await bubble('Verifique a configuração do Apps Script e tente novamente.');
  }
}

// Inicia o fluxo
start();
