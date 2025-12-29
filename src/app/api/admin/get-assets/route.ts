import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { RoleName } from "@prisma/client";
import { blockBrowser } from "@/lib/utils/blockBrowser";

export async function GET(req: NextRequest) {

    const blocked = blockBrowser(req);
    if (blocked) return blocked;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== RoleName.ADMIN) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const typeId = searchParams.get("typeId");

    const assets = await prisma.asset.findMany({
      where: typeId ? { typeId } : {},
      include: { type: true },
      orderBy: { label: "asc" },
    });

    return NextResponse.json(
      { success: true, data: assets },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin get-assets error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
