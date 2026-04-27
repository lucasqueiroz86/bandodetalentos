// ─── BANCO DE TALENTOS CRIATIVOS ─────────────────────────────────────────────
// Google Apps Script — cole este código em script.google.com
//
// 1. Crie um novo projeto em script.google.com
// 2. Cole este arquivo inteiro
// 3. Ajuste as constantes abaixo
// 4. Execute iniciarPlanilha() UMA vez para criar os cabeçalhos
// 5. Publique como Web App (veja SETUP.md)
// ─────────────────────────────────────────────────────────────────────────────

// ── Configure aqui ────────────────────────────────────────────────────────────
const SPREADSHEET_ID  = 'COLE_AQUI_O_ID_DA_PLANILHA';   // ID da sua Google Sheet
const SHEET_NAME      = 'Talentos';                       // Nome da aba
const EMAIL_REMETENTE = 'seuemail@gmail.com';             // Seu e-mail (remetente)
const NOME_BANCO      = 'Banco de Talentos Criativos';    // Nome exibido nos e-mails
// ─────────────────────────────────────────────────────────────────────────────

const COLUNAS = [
  'Data/Hora', 'Nome', 'E-mail', 'WhatsApp', 'Cidade',
  'Portfólio', 'Especialidade', 'Senioridade', 'Modelo de Trabalho',
  'Empresa Aberta?', 'Tipo de Empresa', 'Situação Empregatícia', 'Pretensão (R$)',
];

// ── Entry point GET (health check) ───────────────────────────────────────────
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: NOME_BANCO }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Entry point POST ─────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    salvarNaPlanilha(data);
    enviarEmailConfirmacao(data);
    enviarNotificacaoInterna(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Erro: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Salva linha na planilha ───────────────────────────────────────────────────
function salvarNaPlanilha(d) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  // Garante cabeçalhos se a aba estiver vazia
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUNAS);
    sheet.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold').setBackground('#ff4d00').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    d.timestamp || new Date().toLocaleString('pt-BR'),
    d.name,
    d.email,
    d.phone,
    d.city,
    d.portfolio,
    d.specialty,
    d.seniority,
    d.workmode,
    d.hascompany,
    d.companytype || '—',
    d.employed,
    d.salary ? 'R$ ' + Number(d.salary).toLocaleString('pt-BR') : '—',
  ]);

  // Autofit colunas
  sheet.autoResizeColumns(1, COLUNAS.length);
}

// ── E-mail de confirmação para o cadastrado ───────────────────────────────────
function enviarEmailConfirmacao(d) {
  const assunto = `Bem-vindo(a) ao ${NOME_BANCO}! ✓`;

  const corpo = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111;border-radius:16px;border:1px solid #2a2a2a;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#ff4d00,#ff7a3d);padding:40px 40px 32px;text-align:center;">
            <p style="margin:0 0 8px;color:rgba(255,255,255,.7);font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;">Banco de Talentos</p>
            <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-.02em;">Você está dentro! 🎉</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 16px;color:#f0f0f0;font-size:16px;line-height:1.6;">
              Oi, <strong>${d.name.split(' ')[0]}</strong>! Seu cadastro foi recebido com sucesso.
            </p>
            <p style="margin:0 0 28px;color:#888;font-size:14px;line-height:1.7;">
              Você agora faz parte do nosso banco de talentos criativos. Quando surgir um projeto ou oportunidade que combine com o seu perfil, entraremos em contato por este e-mail ou pelo WhatsApp.
            </p>

            <!-- Resumo do cadastro -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;overflow:hidden;margin-bottom:28px;">
              <tr><td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
                <p style="margin:0;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:600;">Resumo do seu cadastro</p>
              </td></tr>
              ${linha('Especialidade', d.specialty)}
              ${linha('Senioridade',   d.seniority)}
              ${linha('Modelo',        d.workmode)}
              ${linha('Cidade',        d.city)}
              ${linha('Portfólio',     '<a href="' + d.portfolio + '" style="color:#ff7a3d;">' + d.portfolio + '</a>')}
            </table>

            <p style="margin:0;color:#555;font-size:13px;line-height:1.7;">
              Enquanto isso, fique à vontade para atualizar seu portfólio e manter seu trabalho sempre em dia — é o que mais pesa na hora de indicar alguém.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #2a2a2a;text-align:center;">
            <p style="margin:0;color:#444;font-size:12px;">
              ${NOME_BANCO} &nbsp;·&nbsp; Curado com carinho
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();

  GmailApp.sendEmail(d.email, assunto, '', {
    htmlBody: corpo,
    name: NOME_BANCO,
    replyTo: EMAIL_REMETENTE,
  });
}

// ── Notificação interna (para você) ──────────────────────────────────────────
function enviarNotificacaoInterna(d) {
  const assunto = `[Novo talento] ${d.name} — ${d.specialty}`;
  const corpo = `
Novo cadastro recebido no Banco de Talentos!

Nome:          ${d.name}
E-mail:        ${d.email}
WhatsApp:      ${d.phone}
Cidade:        ${d.city}
Especialidade: ${d.specialty}
Senioridade:   ${d.seniority}
Modelo:        ${d.workmode}
Empresa:       ${d.hascompany} (${d.companytype || '—'})
Situação:      ${d.employed}
Pretensão:     R$ ${d.salary}
Portfólio:     ${d.portfolio}
  `.trim();

  GmailApp.sendEmail(EMAIL_REMETENTE, assunto, corpo, {
    name: NOME_BANCO + ' — Sistema',
  });
}

// ── Helper: linha de tabela no e-mail ─────────────────────────────────────────
function linha(label, valor) {
  return `
    <tr>
      <td style="padding:12px 24px;border-bottom:1px solid #222;">
        <span style="color:#555;font-size:12px;display:block;margin-bottom:2px;">${label}</span>
        <span style="color:#e0e0e0;font-size:14px;font-weight:500;">${valor}</span>
      </td>
    </tr>
  `;
}

// ── Utilitário: roda uma vez para criar cabeçalhos ────────────────────────────
function iniciarPlanilha() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet   = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  sheet.clearContents();
  sheet.appendRow(COLUNAS);
  sheet.getRange(1, 1, 1, COLUNAS.length)
    .setFontWeight('bold')
    .setBackground('#ff4d00')
    .setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, COLUNAS.length);

  Logger.log('Planilha iniciada com sucesso!');
}
