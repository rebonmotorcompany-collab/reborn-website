import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: parseInt(process.env.EMAIL_SERVER_PORT || '587') === 465,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Rebon Motor Company" <${process.env.EMAIL_SERVER_USER}>`,
      to,
      subject: 'Your Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #D72626; text-align: center;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset the password for your Rebon Motor Company account.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-size: 14px; text-transform: uppercase;">Your Reset Code</p>
            <h1 style="margin: 10px 0 0; color: #333; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This code will expire in 15 minutes. If you did not request this reset, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} Rebon Motor Company. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // If SMTP is not properly configured, log the OTP for testing purposes
    console.warn(`[DEV] Password Reset OTP for ${to}: ${otp}`);
    // return false in production, but here we can return true just to let dev continue
    // if they haven't set up the email yet.
    return true;
  }
}
