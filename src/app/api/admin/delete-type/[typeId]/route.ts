import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { RoleName } from "@prisma/client";

interface Params {
  params: { typeId: string };
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== RoleName.ADMIN) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const { typeId } =await params;

  try {
    const assetCount = await prisma.asset.count({ where: { typeId } });

    if (assetCount > 0) {
      return NextResponse.json({
        success: false,
        message: "Cannot delete type that has existing assets"
      }, { status: 400 });
    }

    await prisma.assetType.delete({ where: { typeId } });

    return NextResponse.json({
      success: true,
      message: "Asset type deleted successfully"
    });
  } catch (error) {
    console.error("Delete Type Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
