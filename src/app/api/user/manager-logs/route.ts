import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { RoleName, CheckoutStatus } from "@prisma/client";
import { blockBrowser } from "@/lib/utils/blockBrowser";

export async function GET(req:Request) {
  const blocked = blockBrowser(req);
  if (blocked) return blocked;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== RoleName.MANAGER) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const managerId = session.user.id;

    const employeesCount = await prisma.user.count({
      where: { managerId },
    });

    const approvedAssets = await prisma.checkoutHistory.count({
      where: {
        actionById: managerId,
        actionType: CheckoutStatus.APPROVED,
      },
    });


    const activeRecords = await prisma.checkoutRecord.findMany({
      where: {
        user: { managerId },
        status: {
          in: [CheckoutStatus.APPROVED, CheckoutStatus.RETURN_REQUESTED],
        },
      },
      include: { asset: true },
    });

    const activeAssets = activeRecords.reduce(
      (sum, rec) => sum + (rec.quantity ?? 1),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        employeesCount,
        approvedAssets,
        activeAssets, 
      },
    });

  } catch (err) {
    console.error("Manager dashboard error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
