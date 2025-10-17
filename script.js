const chatBox = document.getElementById("chat-box");

function delay(ms){ return new Promise(res => setTimeout(res, ms)); }

async function showMessage(text, sender="bot", delayTime=350){
  const wrap = document.createElement("div");
  wrap.className = "message" + (sender === "user" ? " user" : "");
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = text;
  wrap.appendChild(bubble);
  chatBox.appendChild(wrap);
  chatBox.scrollTop = chatBox.scrollHeight;
  await delay(delayTime);
}

function addButtons(buttons){
  const c = document.createElement("div");
  c.className = "buttons";
  buttons.forEach(({text, onClick}) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = text;
    b.onclick = () => { c.remove(); onClick(); };
    c.appendChild(b);
  });
  chatBox.appendChild(c);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function start(){
  await showMessage("👋 Oi! Eu sou o assistente da Intellih.");
  await showMessage("Quer descobrir como automatizar seu negócio com IA?");
  addButtons([
    { text: "Sim, quero!", onClick: fase2 },
    { text: "Quero ver exemplos", onClick: faseExemplo }
  ]);
}

async function fase2(){
  await showMessage("🚀 Legal! Você é:");
  addButtons([
    { text: "Empreendedor(a)", onClick: () => coleta('Empreendedor') },
    { text: "Autônomo(a)", onClick: () => coleta('Autônomo') },
    { text: "Curioso sobre IA", onClick: () => coleta('Curioso') },
  ]);
}

function faseExemplo(){
  showMessage("👇 Alguns exemplos do que implementamos:", "bot");
  showMessage("⚙️ Captação automática de leads", "bot");
  showMessage("💬 Atendimento inteligente no WhatsApp", "bot");
  showMessage("📊 Relatórios automáticos com IA", "bot");
  addButtons([{ text: "Quero descobrir o ideal para mim", onClick: fase2 }]);
}

function coleta(tipo){
  showMessage("✏️ Digite seu nome:");
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Seu nome completo";
  chatBox.appendChild(input);
  const btn = document.createElement("button");
  btn.textContent = "Próximo";
  btn.onclick = () => coletaEmail(tipo, (input.value || '').trim());
  chatBox.appendChild(btn);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function coletaEmail(tipo, nome){
  if(!nome){ showMessage("⚠️ Por favor, informe seu nome."); return; }
  chatBox.innerHTML = "";
  showMessage(`Perfeito, ${nome}!`);
  showMessage("📧 Agora me diga seu e-mail:");
  const input = document.createElement("input");
  input.type = "email";
  input.placeholder = "seu@email.com";
  chatBox.appendChild(input);
  const btn = document.createElement("button");
  btn.textContent = "Enviar";
  btn.onclick = () => enviarDados({ nome, email: (input.value||'').trim(), tipo });
  chatBox.appendChild(btn);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function enviarDados(payload){
  const { nome, email, tipo } = payload;
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    await showMessage("⚠️ E-mail inválido. Tente novamente.");
    return;
  }
  await showMessage("⏳ Processando seus dados...");
  // Pixel Lead
  try { fbq && fbq('track', 'Lead'); } catch(e) {}
  // Envio ao Apps Script
  fetch("https://script.google.com/macros/s/AKfycbzsU-C8TQ_jvzYApCbIXhlpe07kky2rx-xmpwiDq2zbpipVAjSMcOt01D9LWXjweK6x/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, tipo })
  })
  .then(() => {
    showMessage(`✅ Obrigado, ${nome}!`);
    showMessage("Você receberá seu diagnóstico gratuito em até 24h.");
  })
  .catch(() => {
    showMessage("⚠️ Ocorreu um erro no envio. Tente novamente mais tarde.");
  });
}

start();
