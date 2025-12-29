
import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";
import { AssetStatus, CheckoutStatus, RoleName } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: userId, role } = session.user;

  
    if (role === RoleName.ADMIN) {
      return NextResponse.json(
        { success: false, message: "Admins cannot request assets" },
        { status: 403 }
      );
    }

    const { assetId, quantity } = await req.json();

    if (!assetId || !quantity) {
      return NextResponse.json(
        { success: false, message: "assetId & quantity required" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.findUnique({
      where: { assetId },
    });

    if (!asset) {
      return NextResponse.json(
        { success: false, message: "Asset not found" },
        { status: 404 }
      );
    }

    // Check available quantity
    if (asset.availableQuantity < quantity) {
      return NextResponse.json(
        {
          success: false,
          message: `Only ${asset.availableQuantity} units available`,
        },
        { status: 400 }
      );
    }

    // Deduct available quantity
    const updatedAvailable = asset.availableQuantity - quantity;

    await prisma.asset.update({
      where: { assetId },
      data: {
        availableQuantity: updatedAvailable,
        status: updatedAvailable === 0 ? AssetStatus.PENDING : asset.status, // if 0 then pending
      },
    });

    // Create checkout record with quantity
    const record = await prisma.checkoutRecord.create({
      data: {
        assetId,
        userId,
        quantity,
        status: CheckoutStatus.PENDING,
      },
    });

    return NextResponse.json({
      success: true,
      status: 200,
      data: record,
    });
  } catch (error) {
    console.error("Checkout Create Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}




export const runtime = "nodejs"; 

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userRole = session.user.role as RoleName;

    const url = new URL(req.url);
    const statusParams = url.searchParams.getAll("status");


    const validStatuses = statusParams.filter((s) =>
      Object.values(CheckoutStatus).includes(s as CheckoutStatus)
    ) as CheckoutStatus[];

    const whereFilter:{userId?: string | { in: string[] };
      status?: { in: CheckoutStatus[] };} = {};

    if (userRole === RoleName.EMPLOYEE) {
      whereFilter.userId = userId;
    }


    if (userRole === RoleName.MANAGER) {
      const employees = await prisma.user.findMany({
        where: { managerId: userId },
        select: { userId: true },
      });

      whereFilter.userId = {
        in: [
          userId,
          ...employees.map((e) => e.userId),
        ],
      };
    }

    
    if (userRole === RoleName.ADMIN) {
    }

    if (validStatuses.length > 0) {
      whereFilter.status = { in: validStatuses };
    }


    const records = await prisma.checkoutRecord.findMany({
      where: whereFilter,
      include: {
        asset: {
          include: {
            type: true,
          },
        },
        user: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { checkoutDate: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Checkout Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}