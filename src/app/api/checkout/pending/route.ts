// src/app/api/checkout/pending/route.ts

import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { CheckoutStatus, RoleName } from "@prisma/client";
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

    const userId = session.user.id;
    const role = session.user.role;

 
    if (role === RoleName.ADMIN) {
      return NextResponse.json(
        { success: false, message: "Admins do not request assets" },
        { status: 403 }
      );
    }

    const pendingRecords = await prisma.checkoutRecord.findMany({
      where: {
        userId,
        status: CheckoutStatus.PENDING,
      },
      include: {
        asset: {
          include: {
            type: true,
          },
        },
      },
      orderBy: { checkoutDate: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: pendingRecords.length,
      data: pendingRecords,
    });
  } catch (error) {
    console.error("Pending Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
