

import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { AssetStatus, CheckoutStatus, RoleName } from "@prisma/client";

export async function PATCH(
  req: Request,
    context: { params: Promise<{ recordId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      session.user.role !== RoleName.MANAGER &&
      session.user.role !== RoleName.ADMIN
    ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { recordId } =await context.params;

    if (!recordId) {
      return NextResponse.json(
        { success: false, message: "recordId missing" },
        { status: 400 }
      );
    }

    
    const record = await prisma.checkoutRecord.findUnique({
      where: { recordId },
      include: { asset: true },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    if (record.status !== CheckoutStatus.PENDING) {
      return NextResponse.json(
        { success: false, message: "Already processed" },
        { status: 400 }
      );
    }


    const quantityToRestore = record.quantity ?? 1;

    await prisma.$transaction([
   
      prisma.checkoutRecord.update({
        where: { recordId },
        data: { status: CheckoutStatus.REJECTED },
      }),


      prisma.asset.update({
        where: { assetId: record.assetId },
        data: {
          status:AssetStatus.AVAILABLE,
          availableQuantity: {
            increment: quantityToRestore,
          },
        },
      }),

  
      prisma.checkoutHistory.create({
        data: {
          recordId: record.recordId,
          userId: record.userId,
          actionById: session.user.id,
          actionType: CheckoutStatus.REJECTED,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Rejected successfully",
    });

  } catch (error) {
    console.error("Reject PATCH Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
