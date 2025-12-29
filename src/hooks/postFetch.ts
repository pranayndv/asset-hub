"use server";

import { headers } from "next/headers";

type Payload = FormData | Record<string, unknown> | null;

export async function postFetch(
  url: string,
  payload?: Payload
) {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const isFormData = payload instanceof FormData;

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api${url}`,
    {
      method: "POST",
      headers: {
        Cookie: cookie ?? "",
        ...(isFormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      cache: "no-store",
      body: payload
        ? isFormData
          ? payload 
          : JSON.stringify(payload) 
        : null,
    }
  );

  try {
    return await res.json();
  } catch {
    return { success: false };
  }
}
