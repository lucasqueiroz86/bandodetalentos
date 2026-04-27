# Como configurar o Banco de Talentos

Tempo estimado: 15 minutos.

---

## 1. Criar a Google Sheet

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha nova
2. Dê um nome: **Banco de Talentos Criativos**
3. Copie o **ID da planilha** da URL:
   ```
   https://docs.google.com/spreadsheets/d/  <<< ESTE É O ID >>>  /edit
   ```

---

## 2. Criar o Google Apps Script

1. Acesse [script.google.com](https://script.google.com)
2. Clique em **Novo projeto**
3. Apague todo o código padrão
4. Cole o conteúdo do arquivo `Code.gs`
5. Preencha as constantes no topo:
   ```javascript
   const SPREADSHEET_ID  = 'cole-o-id-aqui';
   const EMAIL_REMETENTE = 'seuemail@gmail.com';
   ```
6. Salve (Ctrl+S) e dê um nome ao projeto: **Banco de Talentos**

---

## 3. Iniciar a planilha

1. No editor do Apps Script, selecione a função `iniciarPlanilha` no dropdown
2. Clique em **Executar ▶**
3. Autorize o script quando solicitado (é seguro — é seu próprio projeto)
4. A aba "Talentos" será criada com os cabeçalhos formatados

---

## 4. Publicar como Web App

1. No editor, clique em **Implantar → Nova implantação**
2. Clique no ícone de engrenagem ⚙ ao lado de "Tipo" e selecione **App da Web**
3. Configure:
   - **Descrição:** Banco de Talentos v1
   - **Executar como:** Eu (seu e-mail)
   - **Quem pode acessar:** Qualquer pessoa
4. Clique em **Implantar**
5. Autorize as permissões (Gmail + Sheets)
6. **Copie a URL gerada** — ela tem este formato:
   ```
   https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec
   ```

---

## 5. Conectar o formulário

1. Abra `index.html`
2. Na linha com `const SCRIPT_URL`, substitua o valor:
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/XXXX/exec';
   ```
3. Salve o arquivo

---

## 6. Hospedar o formulário

Escolha uma das opções abaixo (todas gratuitas):

### Opção A — Netlify Drop (mais fácil, 30 segundos)
1. Acesse [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arraste a pasta do projeto para a página
3. Pronto — você terá uma URL pública como `https://xyz.netlify.app`

### Opção B — GitHub Pages
1. Suba a pasta para um repositório no GitHub
2. Vá em Settings → Pages → Source: main / root
3. URL ficará como `https://seunome.github.io/banco-talentos`

### Opção C — Vercel
```bash
npm i -g vercel
vercel
```

---

## 7. Testar

1. Abra o formulário no navegador
2. Preencha todos os campos e envie
3. Verifique:
   - [ ] Linha apareceu na Google Sheet
   - [ ] E-mail de confirmação chegou para o cadastrado
   - [ ] Você recebeu a notificação interna

---

## Atualizar o script depois

Se editar o `Code.gs`, é preciso **criar uma nova implantação**:
1. Implantar → Gerenciar implantações
2. Clique em ✏️ editar → "Versão: Nova versão"
3. Salvar — a URL permanece a mesma

---

## Campos capturados na planilha

| Coluna | Dado |
|---|---|
| Data/Hora | Timestamp do envio |
| Nome | Nome completo |
| E-mail | E-mail para contato |
| WhatsApp | Telefone |
| Cidade | Cidade + estado |
| Portfólio | Link |
| Especialidade | Área criativa |
| Senioridade | Nível de experiência |
| Modelo de Trabalho | Presencial / Remoto / Híbrido |
| Empresa Aberta? | Sim / Não |
| Tipo de Empresa | MEI, ME, etc. |
| Situação Empregatícia | CLT, PJ, Freelancer, Disponível |
| Pretensão (R$) | Valor mensal |
