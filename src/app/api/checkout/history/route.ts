import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { RoleName } from "@prisma/client";
import { blockBrowser } from "@/lib/utils/blockBrowser";

export async function GET(req:Request) {
  const blocked = blockBrowser(req);
  if (blocked) return blocked;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const role = session.user.role;

    let whereCondition= {};

    if (role === RoleName.EMPLOYEE) {
      // Employee → Only their own actions
      whereCondition = { userId };
    }

    if (role === RoleName.MANAGER) {
      // Manager → 
      // 1. Employees under him
      // 2. Actions he performed (approvals/rejections)
      whereCondition = {
        OR: [
          { actionById: userId },
          {
            user: { managerId: userId }
          }
        ]
      };
    }

    if (role === RoleName.ADMIN) {
      // Admin → View ALL histories
      whereCondition = {}; 
    }

    const history = await prisma.checkoutHistory.findMany({
      where: whereCondition,
      include: {
        record: {
          include: {
            asset: {
              include: {
                type: true,
              },
            },
          },
        },
        user: {
          select: {
            userId: true,
            name: true,
            email: true,
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
      count: history.length,
      data: history,
    });

  } catch (error) {
    console.error("Checkout History Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
