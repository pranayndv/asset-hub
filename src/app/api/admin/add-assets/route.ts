import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { RoleName, AssetStatus } from "@prisma/client";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== RoleName.ADMIN) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();

    const label = formData.get("label") as string;
    const typeId = formData.get("typeId") as string;
    const status = formData.get("status") as AssetStatus | null;
    const quantity = Number(formData.get("quantity") || 1);
    const file = formData.get("image") as File | null;

    if (!label || !typeId) {
      return NextResponse.json(
        { success: false, message: "label and typeId required" },
        { status: 400 }
      );
    }

    if (isNaN(quantity) || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const type = await prisma.assetType.findUnique({ where: { typeId } });
    if (!type) {
      return NextResponse.json(
        { success: false, message: "Invalid typeId" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    if (file && file.size > 0) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      fs.writeFileSync(path.join(uploadDir, filename), bytes);
      imageUrl = `/uploads/${filename}`;
    }


    const validStatus =
      status && Object.values(AssetStatus).includes(status)
        ? status
        : AssetStatus.AVAILABLE;

    const asset = await prisma.asset.create({
      data: {
        label,
        typeId,
        status: validStatus,
        quantity,
        availableQuantity: quantity,
        imageUrl,
      },
      include: { type: true },
    });

    return NextResponse.json(
      { success: true, data: asset },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Asset Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
