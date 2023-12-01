class EmailTemplate {
  constructor(email, subject, text, userName, activationUrl) {
    this.to = email;
    this.subject = subject || "Template Mail";
    this.text = text || "";
    this.html = `
    `;
  }
}

module.exports = EmailTemplate;
