import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ typeId: string }> }
) {
  const { typeId } = await context.params; 

  try {
    const assets = await prisma.asset.findMany({
      where: { typeId },
      include: {
        type: true,
        records: true,
      },
    });

    return NextResponse.json({ success: true, data: assets }, { status: 200 });
  } catch (err) {
    console.error("GET Assets Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}
