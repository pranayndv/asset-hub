import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse, NextRequest } from "next/server";
import { RoleName } from "@prisma/client";
import prisma from "@/lib/db/prisma";

export async function DELETE(
  _req: NextRequest,
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

    await prisma.user.updateMany({
      where: { managerId },
      data: { managerId: null },
    });


    await prisma.user.delete({
      where: { userId: managerId },
    });

    return NextResponse.json({
      success: true,
      message: "Manager deleted successfully",
    });
  } catch (error) {
    console.error("Delete Manager Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
