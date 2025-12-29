import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  const types = await prisma.assetType.findMany();
  return NextResponse.json(types);
}


