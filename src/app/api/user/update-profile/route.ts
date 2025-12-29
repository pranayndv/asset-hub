import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }


    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${session.user.id}-${Date.now()}-${file.name}`;

    const uploadDir = path.join(process.cwd(), "public/uploads/profile");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, bytes);

    const profileUrl = `/uploads/profile/${filename}`;

    const updated = await prisma.user.update({
      where: { userId: session.user.id },
      data: { profileImage: profileUrl },
    });

    return NextResponse.json({
      success: true,
      message: "Profile image updated!",
      profileImage: updated.profileImage,
    });

  } catch (error) {
    console.error("Profile upload error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
