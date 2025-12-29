import prisma from "@/lib/db/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { RoleName } from "@prisma/client";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ assetId: string }> }
) {
  const { assetId } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== RoleName.ADMIN) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  if (!assetId) {
    return NextResponse.json(
      { success: false, message: "assetId missing in URL" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.asset.findUnique({
      where: { assetId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Asset not found" },
        { status: 404 }
      );
    }

    await prisma.asset.delete({
      where: { assetId },
    });

    return NextResponse.json(
      { success: true, message: "Asset deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin delete-asset error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
