import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { RoleName } from "@prisma/client";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      session?.user.role !== RoleName.MANAGER &&
      session?.user.role !== RoleName.ADMIN
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { employeeIds, targetManagerId } = await req.json();

    if (!employeeIds || employeeIds.length === 0 || !targetManagerId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const whereClause =
      session.user.role === RoleName.MANAGER
        ? {
            userId: { in: employeeIds },
            role: RoleName.EMPLOYEE,
            managerId: session.user.id,
          }
        : {
            userId: { in: employeeIds },
            role: RoleName.EMPLOYEE,
          };

    await prisma.user.updateMany({
      where: whereClause,
      data: {
        managerId: targetManagerId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Employees transferred successfully!",
    });
  } catch (error) {
    console.error("Transfer Employees Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
