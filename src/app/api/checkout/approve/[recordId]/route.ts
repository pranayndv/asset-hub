import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { CheckoutStatus, RoleName } from "@prisma/client";

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

    const quantityRequested = record.quantity ?? 1; // fallback to 1
    const availableQuantity = record.asset.availableQuantity;

 
    // if (availableQuantity < quantityRequested) {
    //   return NextResponse.json(
    //     { success: false, message: "Not enough quantity available" },
    //     { status: 400 }
    //   );
    // }

    await prisma.$transaction([
      // Update record
      prisma.checkoutRecord.update({
        where: { recordId },
        data: { status: CheckoutStatus.APPROVED },
      }),

      // Deduct quantity from asset
      prisma.asset.update({
        where: { assetId: record.assetId },
        data: {
          availableQuantity: availableQuantity - quantityRequested,
        },
      }),

      // Create history entry
      prisma.checkoutHistory.create({
        data: {
          recordId: record.recordId,
          userId: record.userId, // employee
          actionById: session.user.id, // manager/admin
          actionType: CheckoutStatus.APPROVED,
          quantity: quantityRequested,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Asset approved successfully",
    });

  } catch (error) {
    console.error("Approve PATCH Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
