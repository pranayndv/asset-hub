
import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  const {id} = await params;

  console.log("assetsId>>>>",id)
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

// Update
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role))
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const data = await req.json();

    const updated = await prisma.asset.update({
      where: { assetId: params.id },
      data,
    });

    return NextResponse.json({ success: true, updated });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// Delete
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN")
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    await prisma.asset.delete({ where: { assetId: params.id } });

    return NextResponse.json({ success: true, message: "Asset deleted" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
