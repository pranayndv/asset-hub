import { headers } from "next/headers";

type FetchResult<T> = {
  data: T | null;
  error: string | null;
};

export default async function patchData<T>(route: string): Promise<FetchResult<T>> {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const url = `${process.env.NEXTAUTH_URL}${route}`;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
      
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        data: null,
        error: `Request error: ${res.status} - ${errText}`,
      };
    }

    const json = (await res.json()) as { data: T };
    return { data: json?.data ?? null, error: null };

  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
