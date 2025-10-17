# Fluxo Interativo Intellih v2

Projeto de captação de leads com experiência de agente (chat visual), pronto para deploy na Vercel.

## Como usar

1. **Pixel Meta**
   - Já configurado com ID **3929736470503988**.
   - Eventos: `PageView` (ao carregar), `Lead` (ao enviar dados).
   - Se quiser trocar o Pixel, edite o `index.html` (fbq('init', 'PIXEL_ID')).

2. **Google Sheets / Apps Script**
   - Endpoint já apontando para:
     - `https://script.google.com/macros/s/AKfycbzTZrWKX3NWnB_683CmMpAAeJlhjBmA_XPwCNOw5m9UjQex89nHaHKP7-N_IUyJ96qi/exec`
   - A planilha recomendada: **Leads Interativo** (aba `Leads`).
   - Payload enviado: `{ nome, email, tipo }`.

3. **Deploy (Vercel)**
   - Faça upload da pasta inteira ou conecte o repo.
   - O projeto é estático (somente HTML/CSS/JS).

4. **Personalização**
   - Cores e estilo em `style.css` (padrão Intellih: preto + laranja `#c44b04`).
   - Textos e etapas em `script.js`.
   - Avatar em `assets/avatar.svg` (substitua por uma imagem 512×512, se preferir).

5. **Medição e Públicos**
   - Crie Públicos Personalizados no Meta Ads a partir dos eventos:
     - `PageView`
     - `Lead`
     - (opcional) adicione eventos personalizados via `fbq('trackCustom', 'NomeDoEvento')`.

---

Feito para: **Intellih Tecnologia** — Outubro/2025.
