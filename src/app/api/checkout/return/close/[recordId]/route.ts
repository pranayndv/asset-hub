import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { AssetStatus, CheckoutStatus, RoleName } from "@prisma/client";

export async function PATCH(
  _req: Request,
  { params }: { params: { recordId: string } }
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

    const { recordId } = await params;

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

    if (record.status !== CheckoutStatus.RETURN_REQUESTED) {
      return NextResponse.json(
        { success: false, message: "Only return requested assets can be closed" },
        { status: 400 }
      );
    }

    const qty = record.quantity ?? 1;

    await prisma.$transaction([
   
      prisma.checkoutRecord.update({
        where: { recordId },
        data: {
          status: CheckoutStatus.CLOSED,
          returnDate: new Date(),
        },
      }),


      prisma.asset.update({
        where: { assetId: record.assetId },
        data: {
          status: AssetStatus.AVAILABLE,
          availableQuantity: record.asset.availableQuantity + qty,
        },
      }),

    
      prisma.checkoutHistory.create({
        data: {
          recordId,
          userId: record.userId,
          actionById: session.user.id,
          actionType: CheckoutStatus.CLOSED,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Return approved & quantity restored",
    });

  } catch (error) {
    console.error("Close Return Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
