import prisma from "@/lib/db/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { RoleName } from "@prisma/client";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ typeId: string }> }
) {
  const { typeId } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== RoleName.ADMIN) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const assetCount = await prisma.asset.count({
      where: { typeId },
    });

    if (assetCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete type that has existing assets",
        },
        { status: 400 }
      );
    }

    await prisma.assetType.delete({
      where: { typeId },
    });

    return NextResponse.json({
      success: true,
      message: "Asset type deleted successfully",
    });
  } catch (error) {
    console.error("Delete Type Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
