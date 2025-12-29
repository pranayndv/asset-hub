"use server"
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";



export async function checkoutRquest(assetId: string, quantity: number) {
  const headersList = await headers();
  const cookie = await headersList.get("cookie");

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie ?? "",
    },
    cache: "no-store",
    body: JSON.stringify({ assetId, quantity }),
  });

  let data = null;
  try {
    data = await res.json();
     revalidatePath("/asset-types")
  } catch {
    return { success: false };
  }

  return data;
}



export async function checkoutApprove(recordId: string) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/checkout/approve/${recordId}`, {
    method: "PATCH",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
      
    });

  let data = null;
  try {
    data = await res.json();
    revalidatePath("/manager")
    return { success: true }
  } catch {
    console.warn("No JSON returned");
    return { success: false };
  }

  return data;
}




export async function checkoutReject(recordId: string) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/checkout/reject/${recordId}`, {
    method: "PATCH",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
      
    });

  let data = null;
  try {
    data = await res.json();
     revalidatePath("/manager")
  } catch {
    console.warn("No JSON returned");
    return { success: false };
  }

  return data;
}


export async function checkoutCancel(recordId: string) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/checkout/cancel/${recordId}`, {
    method: "PATCH",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
      
    });

  let data = null;
  try {
    data = await res.json();
     revalidatePath("/manager")
     revalidatePath("/employee")
  } catch {
    console.warn("No JSON returned");
    return { success: false };
  }

  return data;
}

export async function checkoutReturn(recordId: string) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/checkout/return/request/${recordId}`, {
    method: "PATCH",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
      
    });

  let data = null;
  try {
    data = await res.json();
     revalidatePath("/employee")
  } catch {
    console.warn("No JSON returned");
    return { success: false };
  }

  return data;
}

export async function checkoutClose(recordId: string) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/checkout/return/close/${recordId}`, {
    method: "PATCH",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
      
    });

  let data = null;
  try {
    data = await res.json();
     revalidatePath("/manager")
  } catch {
    console.warn("No JSON returned");
    return { success: false };
  }

  return data;
}


export async function returnCancel(recordId: string) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/checkout/return/cancel/${recordId}`, {
    method: "PATCH",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
      
    });

  let data = null;
  try {
    data = await res.json();
     revalidatePath("/manager")
     revalidatePath("/employee")
    return { success: true };
  } catch {
    console.warn("No JSON returned");
    return { success: false };
  }

  return data;
}


export async function checkoutMakeAvailable(recordId: string) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/checkout/reject/available/${recordId}`, {
    method: "PATCH",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
      
    });

  let data = null;
  try {
    data = await res.json();
      revalidatePath("/manager")
  } catch {
    console.warn("No JSON returned");
    return { success: false };
  }

  return data;
}
