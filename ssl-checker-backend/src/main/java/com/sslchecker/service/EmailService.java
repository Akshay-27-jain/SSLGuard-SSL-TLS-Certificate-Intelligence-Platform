package com.sslchecker.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:jainakshay0804@gmail.com}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends an HTML password reset email containing a secure token link.
     */
    public void sendPasswordResetEmail(String toEmail, String fullName, String resetToken) {
        String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;
        String subject = "🔒 Reset Your SSLGuard Password";

        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
                .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 32px 24px; text-align: center; color: #ffffff; }
                .content { padding: 32px 28px; line-height: 1.6; font-size: 15px; }
                .btn { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: bold; margin: 20px 0; text-align: center; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
                .footer { padding: 20px 28px; background: #f1f5f9; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
                .token-box { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 13px; word-break: break-all; margin-top: 12px; color: #334155; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin:0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SSLGuard Security</h1>
                  <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 13px;">Certificate Intelligence & Expiry Defense</p>
                </div>
                <div class="content">
                  <p>Hello <strong>%s</strong>,</p>
                  <p>We received a request to reset the password for your SSLGuard account associated with <strong>%s</strong>.</p>
                  <p style="text-align: center;">
                    <a href="%s" class="btn">Reset Your Password</a>
                  </p>
                  <p style="font-size: 13px; color: #64748b;">Or paste this link into your browser:</p>
                  <div class="token-box">%s</div>
                  <p style="margin-top: 24px; font-size: 13px; color: #64748b;">⚠️ This password reset link will expire in <strong>60 minutes</strong>. If you did not request this, please ignore this email.</p>
                </div>
                <div class="footer">
                  © 2026 SSLGuard Inc. · Direct TCP 443 Socket Handshake & PKI Defense
                </div>
              </div>
            </body>
            </html>
            """.formatted(fullName != null ? fullName : "User", toEmail, resetUrl, resetUrl);

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    /**
     * Sends an HTML SSL certificate expiration alert email.
     */
    public void sendSslExpiryAlert(String toEmail, String fullName, String domain, int daysRemaining, String issuer, String grade) {
        String subject = "⚠️ SSL Certificate Expiration Alert: " + domain + " (" + daysRemaining + " days left)";

        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
                .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 28px 24px; text-align: center; color: #ffffff; }
                .content { padding: 32px 28px; line-height: 1.6; font-size: 15px; }
                .alert-card { background: #fffbeb; border: 1px solid #fde68a; border-radius: 14px; padding: 18px; margin: 20px 0; }
                .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; background: #fef3c7; color: #92400e; }
                .btn { display: inline-block; padding: 12px 24px; background: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 15px; }
                .footer { padding: 20px 28px; background: #f1f5f9; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin:0; font-size: 22px; font-weight: 800;">SSL / TLS Certificate Expiry Warning</h1>
                </div>
                <div class="content">
                  <p>Hello <strong>%s</strong>,</p>
                  <p>Our automated background TLS socket checker detected that your SSL certificate for <strong>%s</strong> is approaching expiration.</p>
                  
                  <div class="alert-card">
                    <p style="margin: 0 0 8px 0; font-size: 16px;"><strong>Domain:</strong> %s</p>
                    <p style="margin: 0 0 8px 0;"><strong>Days Remaining:</strong> <span style="font-weight: 900; font-size: 18px; color: #d97706;">%d days</span></p>
                    <p style="margin: 0 0 8px 0;"><strong>Issuer:</strong> %s</p>
                    <p style="margin: 0;"><strong>Security Posture Grade:</strong> <span class="badge">%s</span></p>
                  </div>

                  <p>Please renew this certificate immediately to prevent browser warnings and service outages for your visitors.</p>
                  <p style="text-align: center;">
                    <a href="http://localhost:5173/domains" class="btn">View Monitored Fleet</a>
                  </p>
                </div>
                <div class="footer">
                  SSLGuard Continuous TLS Intelligence · Automated Socket 443 Defense
                </div>
              </div>
            </body>
            </html>
            """.formatted(fullName != null ? fullName : "User", domain, domain, daysRemaining, issuer != null ? issuer : "Unknown CA", grade != null ? grade : "A");

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    /**
     * Sends a test verification email to confirm SMTP configuration.
     */
    public void sendTestEmail(String toEmail) {
        String subject = "✅ SSLGuard Email System Test: Connection Verified";
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <body style="font-family: sans-serif; background-color: #f8fafc; padding: 20px;">
              <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0;">
                <h2 style="color: #059669; margin-top: 0;">SMTP Verification Successful!</h2>
                <p>Hello Akshay,</p>
                <p>Your 16-character Google App Password for Gmail SMTP is active and working properly.</p>
                <p>All automated SSL certificate expiration warnings and password recovery links will now be delivered reliably.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #64748b;">SSLGuard Security Platform · %s</p>
              </div>
            </body>
            </html>
            """.formatted(fromEmail);

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    private void sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "SSLGuard Alerts");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email dispatched successfully to: {} [Subject: {}]", toEmail, subject);
        } catch (MessagingException e) {
            log.error("Failed to construct email for {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Email delivery failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error sending email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Email delivery failed: " + e.getMessage());
        }
    }
}
