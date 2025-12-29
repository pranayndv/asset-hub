 

import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { CheckoutStatus } from "@prisma/client";

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

 
    if (session.user.role === 'ADMIN' ) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    if (record.status !== CheckoutStatus.RETURN_REQUESTED) {
      return NextResponse.json(
        {
          success: false,
          message: "Only return requested records can be cancelled",
        },
        { status: 400 }
      );
    }

    const qty = record.quantity ?? 1;

    await prisma.$transaction([
      
      prisma.checkoutRecord.update({
        where: { recordId },
        data: {
          status: CheckoutStatus.APPROVED,
          returnDate: null,
        },
      }),

     
      prisma.asset.update({
        where: { assetId: record.assetId },
        data: {
          availableQuantity: { decrement: qty },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Return request cancelled successfully",
    });

  } catch (error) {
    console.error("Return Cancel Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
