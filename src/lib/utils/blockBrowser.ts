import { NextResponse } from "next/server";

export function blockBrowser(req: Request) {
  const isBrowserRequest = req.headers.get("accept")?.includes("text/html");

  if (isBrowserRequest) {
    return NextResponse.json(
      { success: false, message: "Direct browser access not allowed" },
      { status: 403 }
    );
  }

  return null; 
}
