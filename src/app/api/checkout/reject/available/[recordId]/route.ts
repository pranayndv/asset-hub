

import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { CheckoutStatus, RoleName } from "@prisma/client";

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

    if (record.status !== CheckoutStatus.REJECTED) {
      return NextResponse.json(
        { success: false, message: "Only rejected assets can be restored" },
        { status: 400 }
      );
    }

    const qty = record.quantity ?? 1;

    await prisma.$transaction([
   
      prisma.asset.update({
        where: { assetId: record.assetId },
        data: {
          availableQuantity: {
            increment: qty,
          },
        },
      }),


      prisma.checkoutRecord.update({
        where: { recordId },
        data: { status: CheckoutStatus.CLOSED },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Asset quantity restored successfully.",
    });

  } catch (error) {
    console.error("Restore Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
