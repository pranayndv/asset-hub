import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { RoleName } from "@prisma/client";

interface RouteParams {
  params: { assetId: string };
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== RoleName.ADMIN) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  const { assetId } =await params;

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
