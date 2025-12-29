 
import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import nodemailer from "nodemailer";
import { RoleName } from "@prisma/client";

 export const runtime = "nodejs";

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

    if (!session?.user || session.user.role !== RoleName.MANAGER) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

   
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newEmployee = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: RoleName.EMPLOYEE,
        managerId: session.user.id,
      },
    });

  
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
      subject: "Your AssetHub Account Credentials",
      html: `
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your account has been created under Manager <b>${session.user.name}</b>.</p>
        <p><strong>Login Credentials:</strong></p>
        <p>Email: ${email}<br>Password: <b>${plainPassword}</b></p>
        <p>You can now log in to AssetHub.</p>
        <br/>
        <p>Thank you.</p>
        <strong>AssetHub Team</strong>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Employee created & login details emailed!",
      data: newEmployee,
    });

  } catch (error) {
    console.error("Create Employee Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
