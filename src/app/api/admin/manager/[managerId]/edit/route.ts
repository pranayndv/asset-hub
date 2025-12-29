
import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse, NextRequest } from "next/server";
import { RoleName } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ managerId: string }> }
) {
  try {
    const { managerId } = await context.params;

    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== RoleName.ADMIN) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { name, email, password } = await req.json();

    const data: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, 10);

    const updated = await prisma.user.update({
      where: { userId: managerId },
      data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Edit Manager Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
