import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { RoleName } from "@prisma/client";
import { blockBrowser } from "@/lib/utils/blockBrowser";

export async function GET(req:Request) {
  const blocked = blockBrowser(req);
  if (blocked) return blocked;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== RoleName.MANAGER) {
      return NextResponse.json(
        { success: false, message: "Only managers allowed" },
        { status: 403 }
      );
    }

    const managerId = session.user.id;

    const employees = await prisma.user.findMany({
      where: {
        managerId: managerId,
        role: RoleName.EMPLOYEE, 
      },
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        profileImage:true
      },
    });

    return NextResponse.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.error("Get Manager Employees Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
