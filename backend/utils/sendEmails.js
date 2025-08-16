const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AlphaTasks" <${process.env.EMAIL_USER}>`,
      to,
      subject: subject || "Réinitialisation de mot de passe - AlphaTasks",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #1e40af;">Réinitialisation de votre mot de passe</h2>
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur <strong>AlphaTasks</strong>.</p>
          <p>Veuillez cliquer sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
          <div style="margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Réinitialiser mon mot de passe</a>
          </div>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
          <br/>
          <p style="font-size: 14px; color: gray;">— L’équipe AlphaTasks</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email envoyé à :", to);
  } catch (error) {
    console.error(" Erreur d'envoi du mail:", error);
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

module.exports = sendEmail;
