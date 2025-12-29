import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { RoleName } from "@prisma/client";
import { blockBrowser } from "@/lib/utils/blockBrowser";

export async function GET(req:Request) {
  const blocked = blockBrowser(req);
  if (blocked) return blocked;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  const managers = await prisma.user.findMany({
    where: { role: RoleName.MANAGER },
    select: { userId: true, name: true , email:true, profileImage:true}
  });

  return NextResponse.json({ success: true, data: managers });
}
