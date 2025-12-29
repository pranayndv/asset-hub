import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.resetOtpExp && user.resetOtpExp > new Date()) {
      return NextResponse.json(
        { success: false, message: "OTP already sent. Please wait before requesting again." },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiry (10 mins)
    await prisma.user.update({
      where: { email },
      data: {
        resetOtp: otp,
        resetOtpExp: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_ID,
      to: email,
      subject: "AssetHub Password Reset OTP",
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully!",
    });
  } catch (error) {
    console.error("request-reset error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
