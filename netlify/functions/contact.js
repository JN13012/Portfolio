const CONTACT_TO_EMAIL = "jeremie.nagi@epitech.eu";

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { message: "Méthode non autorisée." });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return jsonResponse(500, {
      message: "Configuration email manquante côté serveur.",
    });
  }

  let payload;

  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { message: "Format de requête invalide." });
  }

  const { name, email, subject, message, company } = payload;

  if (company) {
    return jsonResponse(200, { message: "Message envoyé." });
  }

  if (!name || !email || !subject || !message) {
    return jsonResponse(400, {
      message: "Tous les champs sont obligatoires.",
    });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: process.env.CONTACT_TO_EMAIL || CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `[Portfolio] ${subject}`,
      text: `Nom: ${name}\nEmail: ${email}\nSujet: ${subject}\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Nouveau message depuis le portfolio</h2>
          <p><strong>Nom:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Sujet:</strong> ${safeSubject}</p>
          <hr />
          <p>${safeMessage}</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    return jsonResponse(502, {
      message: "Le service d'envoi email a refusé la demande.",
    });
  }

  return jsonResponse(200, { message: "Message envoyé." });
};
