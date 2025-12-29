import prisma from "@/lib/db/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const asset = await prisma.asset.findUnique({
      where: { assetId: id },
      include: {
        type: true,
        records: true,
      },
    });

    if (!asset) {
      return NextResponse.json(
        { success: false, message: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: asset });
  } catch (err) {
    console.error("GET Asset Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const data = await req.json();

    const updated = await prisma.asset.update({
      where: { assetId: id },
      data,
    });

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error("PATCH Asset Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.asset.delete({
      where: { assetId: id },
    });

    return NextResponse.json({
      success: true,
      message: "Asset deleted",
    });
  } catch (err) {
    console.error("DELETE Asset Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
