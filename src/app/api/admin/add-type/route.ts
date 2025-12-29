import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { RoleName } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);


    if (!session?.user || session.user.role !== RoleName.ADMIN) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { name, description } = await req.json();


    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Asset type name is required" },
        { status: 400 }
      );
    }

 
    const existing = await prisma.assetType.findFirst({
      where: { name: name.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Asset type already exists" },
        { status: 409 }
      );
    }

 
    const assetType = await prisma.assetType.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(
      { success: true, data: assetType },
      { status: 201 }
    );

  } catch (error) {
    console.error("Add Asset Type Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
