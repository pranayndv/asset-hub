import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
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

    const records = await prisma.checkoutRecord.findMany({
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
        asset: {
          select: { label: true, status: true,quantity:true,availableQuantity:true, type: true },
        },
      },
      orderBy: { checkoutDate: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (err) {
    console.error("Checkout Fetch Error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
