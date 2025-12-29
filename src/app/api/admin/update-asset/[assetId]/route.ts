import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { RoleName, AssetStatus } from "@prisma/client";

interface RouteParams {
  params: { assetId: string };
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== RoleName.ADMIN) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { assetId } = await params;

    if (!assetId) {
      return NextResponse.json(
        { success: false, message: "assetId missing" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { label, typeId, status, imageUrl, quantity, availableQuantity } = body;

    if (!label && !typeId && !status && !imageUrl && !quantity && !availableQuantity) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 }
      );
    }

    // Fetch current asset
    const existing = await prisma.asset.findUnique({ where: { assetId } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Asset not found" },
        { status: 404 }
      );
    }

    // Validate typeId
    if (typeId) {
      const typeExists = await prisma.assetType.findUnique({ where: { typeId } });
      if (!typeExists) {
        return NextResponse.json(
          { success: false, message: "Invalid typeId" },
          { status: 400 }
        );
      }
    }

    // Validate status
    if (status && !Object.values(AssetStatus).includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // Validate quantity updates
    let newQuantity = existing.quantity;
    let newAvailable = existing.availableQuantity;

    if (quantity !== undefined) {
      const qty = Number(quantity);
      if (isNaN(qty) || qty < 1) {
        return NextResponse.json(
          { success: false, message: "Invalid quantity" },
          { status: 400 }
        );
      }

      // Prevent quantity < availableQuantity
      if (qty < existing.availableQuantity) {
        return NextResponse.json(
          { success: false, message: "Quantity cannot be less than available quantity" },
          { status: 400 }
        );
      }

      newQuantity = qty;
    }

    // Validate availableQuantity update
    if (availableQuantity !== undefined) {
      const avail = Number(availableQuantity);

      if (isNaN(avail) || avail < 0) {
        return NextResponse.json(
          { success: false, message: "Invalid availableQuantity" },
          { status: 400 }
        );
      }

      if (avail > newQuantity) {
        return NextResponse.json(
          { success: false, message: "Available quantity cannot exceed total quantity" },
          { status: 400 }
        );
      }

      newAvailable = avail;
    }

    // Update asset
    const updated = await prisma.asset.update({
      where: { assetId },
      data: {
        ...(label && { label }),
        ...(typeId && { typeId }),
        ...(status && { status }),
        ...(imageUrl && { imageUrl }),
        quantity: newQuantity,
        availableQuantity: newAvailable,
      },
      include: { type: true },
    });

    return NextResponse.json({ success: true, data: updated });

  } catch (error) {
    console.error("Update Asset Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
