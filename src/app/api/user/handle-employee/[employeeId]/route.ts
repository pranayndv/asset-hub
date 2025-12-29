import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { RoleName } from "@prisma/client";

interface RouteParams {
  params: { employeeId: string };
}

export async function PATCH(req: Request, 
              context: { params: Promise<{ employeeId: string }> }
                           ) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { employeeId } =await context.params;
    const { id: currentUserId, role } = session.user;
    const body = await req.json();

    const whereCondition =
      role === RoleName.ADMIN
        ? { userId: employeeId }
        : { userId: employeeId, managerId: currentUserId };

    const employee = await prisma.user.findFirst({ where: whereCondition });
    if (!employee) {
      return NextResponse.json(
        { success: false, message: "Employee not found or not under your management" },
        { status: 404 }
      );
    }

    const updated = await prisma.user.update({
      where: { userId: employeeId },
      data: body,
      select: { userId: true, name: true, email: true, managerId: true }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Employee Update Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}


export async function DELETE(_req: Request, context: { params: Promise<{ employeeId: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { employeeId } =await context.params;
    const { id: currentUserId, role } = session.user;

    const whereCondition =
      role === RoleName.ADMIN
        ? { userId: employeeId }
        : { userId: employeeId, managerId: currentUserId };

    const employee = await prisma.user.findFirst({ where: whereCondition });

    if (!employee) {
      return NextResponse.json(
        { success: false, message: "Employee not found or not under your management" },
        { status: 404 }
      );
    }

    await prisma.user.delete({ where: { userId: employeeId } });

    return NextResponse.json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (error) {
    console.error("Employee Delete Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
