import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";
import { RoleName } from "@prisma/client";
import { blockBrowser } from "@/lib/utils/blockBrowser";

export async function GET(req: NextRequest) {

    const blocked = blockBrowser(req);
    if (blocked) return blocked;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const managerIdParam = url.searchParams.get("managerId");

  let managerId = "";

  if (session.user.role === RoleName.MANAGER) {
  
    managerId = session.user.id;
  } else if (session.user.role === RoleName.ADMIN && managerIdParam) {
  
    managerId = managerIdParam;
  } else {
    return NextResponse.json(
      { success: false, message: "Manager selection required" },
      { status: 400 }
    );
  }

  const employees = await prisma.user.findMany({
    where: { managerId },
    select: { userId: true, name: true, email:true,profileImage:true }
  });

  return NextResponse.json({ success: true, data: employees });
}
