// src/app/api/admin/analytics/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import { AssetStatus, CheckoutStatus, RoleName } from "@prisma/client";
import type {
  AdminAnalytics,
  ManagerAnalytics,
  AnalyticsApiResponse,
} from "@/lib/types/analytics";
import { blockBrowser } from "@/lib/utils/blockBrowser";

 export async function GET(req:Request): Promise<NextResponse<AnalyticsApiResponse>> {
     blockBrowser(req);
    
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, data: null },
        { status: 401 }
      );
    }

    const role = session.user.role;

    if (role === RoleName.ADMIN) {
      const [managerCount, employeeCount] = await Promise.all([
        prisma.user.count({ where: { role: RoleName.MANAGER } }),
        prisma.user.count({ where: { role: RoleName.EMPLOYEE } }),
      ]);

      // Quantity-based analytics
      const assets = await prisma.asset.findMany();
      const totalUnits = assets.reduce((sum, a) => sum + (a.quantity ?? 1), 0);

      const availableUnits = assets.reduce(
        (sum, a) =>
          a.status === AssetStatus.AVAILABLE
            ? sum + (a.quantity ?? 1)
            : sum,
        0
      );

      const checkedOutUnits = assets.reduce(
        (sum, a) =>
          a.status === AssetStatus.CHECKED_OUT
            ? sum + (a.quantity ?? 1)
            : sum,
        0
      );

      const inMaintenanceUnits = assets.reduce(
        (sum, a) =>
          a.status === AssetStatus.IN_MAINTENANCE
            ? sum + (a.quantity ?? 1)
            : sum,
        0
      );

      const lostUnits = assets.reduce(
        (sum, a) =>
          a.status === AssetStatus.LOST
            ? sum + (a.quantity ?? 1)
            : sum,
        0
      );

      const retiredUnits = assets.reduce(
        (sum, a) =>
          a.status === AssetStatus.RETIRED
            ? sum + (a.quantity ?? 1)
            : sum,
        0
      );

      // Requests
      const [
        pendingReq,
        approvedReq,
        rejectedReq,
        returnRequestedReq,
        closedReq,
      ] = await Promise.all([
        prisma.checkoutRecord.count({ where: { status: CheckoutStatus.PENDING } }),
        prisma.checkoutRecord.count({ where: { status: CheckoutStatus.APPROVED } }),
        prisma.checkoutRecord.count({ where: { status: CheckoutStatus.REJECTED } }),
        prisma.checkoutRecord.count({
          where: { status: CheckoutStatus.RETURN_REQUESTED },
        }),
        prisma.checkoutRecord.count({ where: { status: CheckoutStatus.CLOSED } }),
      ]);

      const payload: AdminAnalytics = {
        userRole: "ADMIN",
        managers: managerCount,
        employees: employeeCount,
        assets: {
          total: totalUnits,
          available: availableUnits,
          checkedOut: checkedOutUnits,
          inMaintenance: inMaintenanceUnits,
          lost: lostUnits,
          retired: retiredUnits,
        },
        requests: {
          pending: pendingReq,
          approved: approvedReq,
          rejected: rejectedReq,
          returnRequested: returnRequestedReq,
          closed: closedReq,
        },
      };

      return NextResponse.json({ success: true, data: payload });
    }


    if (role === RoleName.MANAGER) {
      const managerId = session.user.id;

      const teamEmployees = await prisma.user.count({
        where: {
          managerId,
          role: RoleName.EMPLOYEE,
        },
      });

      const activeAssets = await prisma.checkoutRecord.count({
        where: {
          user: { managerId },
          status: { in: [CheckoutStatus.APPROVED, CheckoutStatus.RETURN_REQUESTED] },
        },
      });

      const [
        pendingReq,
        approvedReq,
        rejectedReq,
        returnRequestedReq,
        closedReq,
      ] = await Promise.all([
        prisma.checkoutRecord.count({
          where: { user: { managerId }, status: CheckoutStatus.PENDING },
        }),
        prisma.checkoutRecord.count({
          where: { user: { managerId }, status: CheckoutStatus.APPROVED },
        }),
        prisma.checkoutRecord.count({
          where: { user: { managerId }, status: CheckoutStatus.REJECTED },
        }),
        prisma.checkoutRecord.count({
          where: { user: { managerId }, status: CheckoutStatus.RETURN_REQUESTED },
        }),
        prisma.checkoutRecord.count({
          where: { user: { managerId }, status: CheckoutStatus.CLOSED },
        }),
      ]);

      const payload: ManagerAnalytics = {
        userRole: "MANAGER",
        teamEmployees,
        activeAssets,
        requests: {
          pending: pendingReq,
          approved: approvedReq,
          rejected: rejectedReq,
          returnRequested: returnRequestedReq,
          closed: closedReq,
        },
      };

      return NextResponse.json({ success: true, data: payload });
    }


    return NextResponse.json({ success: true, data: null });

  } catch (error) {
    console.error("Admin Analytics Error:", error);
    return NextResponse.json(
      { success: false, data: null },
      { status: 500 }
    );
  }
}
