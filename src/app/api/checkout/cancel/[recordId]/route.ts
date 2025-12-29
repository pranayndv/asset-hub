// src/app/api/checkout/cancel/[recordId]/route.ts
import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { AssetStatus, CheckoutStatus } from "@prisma/client";

export async function PATCH(
  _req: Request,
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

    const { recordId } = await context.params;

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

    if (record.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    if (record.status !== CheckoutStatus.PENDING) {
      return NextResponse.json(
        { success: false, message: "Only pending requests can be cancelled" },
        { status: 400 }
      );
    }

    // Quantity requested in this record
    const qty = record.quantity ?? 1;

    await prisma.$transaction([
      prisma.asset.update({
        where: { assetId: record.assetId },
        data: {
          status:AssetStatus.AVAILABLE,
          availableQuantity: record.asset.availableQuantity + qty,
        },
      }),

      // Delete history (if any existed)
      prisma.checkoutHistory.deleteMany({
        where: { recordId },
      }),

      // Delete the request record
      prisma.checkoutRecord.delete({
        where: { recordId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Request cancelled successfully",
    });

  } catch (error) {
    console.error("Cancel Checkout Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
