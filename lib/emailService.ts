// Email service stub for doctor notifications
// Real implementation would use nodemailer as per dashboard.md

export async function sendEmailNotification(to: string, subject: string, body: string) {
  console.log(`[Email Stub] Sending email to ${to}: ${subject}`)
  // Implementation withheld until SMTP details are available
}
