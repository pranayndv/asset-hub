import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { Prisma, RoleName } from "@prisma/client";
import { blockBrowser } from "@/lib/utils/blockBrowser";

export async function GET(req:Request) {
  const blocked = blockBrowser(req);
  if (blocked) return blocked;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("managerId");
    const employeeId = searchParams.get("employeeId");

    let whereCondition: Prisma.CheckoutHistoryWhereInput = {};

    // Admin
    if (session.user.role === RoleName.ADMIN) {
      if (managerId) whereCondition.actionById = managerId;
      if (employeeId) whereCondition.userId = employeeId;
    }

    //  Manager
    if (session.user.role === RoleName.MANAGER) {
      const currentManagerId = session.user.id;

      if (managerId && managerId !== currentManagerId) {
        return NextResponse.json({
          success: false,
          message: "Forbidden: Manager can only view assigned team logs"
        }, { status: 403 });
      }

      whereCondition = {
        OR: [
          { actionById: currentManagerId },
          {
            user: {
              managerId: currentManagerId,
            },
          },
        ],
      };

      if (employeeId) {
        whereCondition = {
          ...whereCondition,
          userId: employeeId,
        };
      }
    }

    const logs = await prisma.checkoutHistory.findMany({
      where: whereCondition,
      include: {
        record: {
          include: {
            asset: true,
          },
        },
        user: {
          select: {
            userId: true,
            name: true,
            email: true,
            managerId: true,
          },
        },
        actionBy: {
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { actionDate: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: logs.length,
      data: logs,
    });

  } catch (error) {
    console.error("Fetch Logs Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
