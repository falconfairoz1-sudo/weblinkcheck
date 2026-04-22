const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send email notification
 */
exports.sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Skip if email not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email not configured, skipping notification');
      return { success: false, message: 'Email not configured' };
    }

    const mailOptions = {
      from: `"LinkGuard Security" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send high-risk URL alert
 */
exports.sendHighRiskAlert = async (user, scan) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">⚠️ High-Risk URL Detected</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb;">
        <p style="font-size: 16px; color: #333;">Hello ${user.name},</p>
        
        <p style="font-size: 14px; color: #666;">
          LinkGuard has detected a high-risk URL in your recent scan:
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 20px 0;">
          <p style="margin: 0; color: #666; font-size: 12px;">URL:</p>
          <p style="margin: 5px 0 15px 0; color: #000; font-size: 14px; word-break: break-all;">
            <strong>${scan.url}</strong>
          </p>
          
          <p style="margin: 0; color: #666; font-size: 12px;">Risk Score:</p>
          <p style="margin: 5px 0 15px 0; color: #ef4444; font-size: 18px;">
            <strong>${scan.riskScore}/100</strong>
          </p>
          
          <p style="margin: 0; color: #666; font-size: 12px;">Status:</p>
          <p style="margin: 5px 0 0 0; color: #ef4444; font-size: 16px;">
            <strong>${scan.status.toUpperCase()}</strong>
          </p>
        </div>
        
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #991b1b; font-size: 14px;">
            <strong>⚠️ Security Recommendation:</strong><br>
            Do not visit this URL. It has been flagged as potentially dangerous by our security analysis.
          </p>
        </div>
        
        <p style="font-size: 14px; color: #666;">
          Scanned at: ${new Date(scan.createdAt).toLocaleString()}
        </p>
      </div>
      
      <div style="padding: 20px; background: #1f2937; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          This is an automated security alert from LinkGuard<br>
          Stay safe online! 🛡️
        </p>
      </div>
    </div>
  `;

  return await this.sendEmail({
    to: user.email,
    subject: '⚠️ High-Risk URL Alert - LinkGuard',
    html
  });
};

/**
 * Send welcome email
 */
exports.sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">🛡️ Welcome to LinkGuard!</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb;">
        <p style="font-size: 16px; color: #333;">Hello ${user.name},</p>
        
        <p style="font-size: 14px; color: #666;">
          Thank you for joining LinkGuard! Your account has been successfully created.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3b82f6; margin-top: 0;">What you can do with LinkGuard:</h3>
          <ul style="color: #666; font-size: 14px; line-height: 1.8;">
            <li>🔍 Scan URLs for phishing and malware</li>
            <li>📊 View detailed security analysis</li>
            <li>📱 Scan QR codes before visiting</li>
            <li>👁️ Monitor URLs for status changes</li>
            <li>📄 Export PDF security reports</li>
            <li>📈 Track your scan history</li>
          </ul>
        </div>
        
        <p style="font-size: 14px; color: #666;">
          Start protecting yourself from malicious links today!
        </p>
      </div>
      
      <div style="padding: 20px; background: #1f2937; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          Stay safe online! 🛡️
        </p>
      </div>
    </div>
  `;

  return await this.sendEmail({
    to: user.email,
    subject: '🛡️ Welcome to LinkGuard - Your Link Safety Companion',
    html
  });
};
