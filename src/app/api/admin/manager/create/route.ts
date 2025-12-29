// src/app/api/admin/create-manager/route.ts
import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { RoleName } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

function generatePassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
  let pwd = "";
  for (let i = 0; i < 8; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  return pwd;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== RoleName.ADMIN) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name & Email required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }


    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const manager = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: RoleName.MANAGER,
      },
    });

    // Send Mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AssetHub System" <${process.env.EMAIL_ID}>`,
      to: email,
      subject: "Your Manager Account Credentials",
      html: `
        <h3>Hello ${name},</h3>
        <p>You have been assigned as a <strong>Manager</strong> in AssetHub.</p>

        <p><strong>Your Login Credentials:</strong></p>
        <p>Email: ${email}<br>Password: <b>${plainPassword}</b></p>

        <p>You can now log in and manage employees & assets.</p>
        <br/>
        <p>Regards,</p>
        <strong>AssetHub Team</strong>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Manager created & login credentials emailed!",
      data: manager,
    });
  } catch (error) {
    console.error("Create Manager Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
