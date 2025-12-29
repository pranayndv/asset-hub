import nodemailer from "nodemailer";

export async function sendOtpEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"AssetHub Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP - AssetHub",
    html: `
      <div style="font-family:Arial; max-width:450px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:8px;">
        <h2>Reset Your Password</h2>
        <p>Use the OTP below to reset your AssetHub password:</p>
        <h1 style="background:#111; color:#fff; padding:10px; text-align:center; border-radius:6px;">
          ${otp}
        </h1>
        <p>This OTP is valid for only 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
