"use server"

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

    interface Type{
        name: string;
        description :string
    }

    export async function addAssetType(type:Type) {
    const headersList = await headers();
    const cookie = await headersList.get("cookie");
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/add-type`, {
        method: "POST",
       headers: {
            Cookie: cookie ?? "",
          },
          cache: "no-store",
          body: JSON.stringify(type),
        });
      let data = null;
      try {
        data = await res.json();
         revalidatePath("/admin")
      } catch {
        return { success: false };
      }
      return data;
    }


    interface Asset{
        label:string;
        typeId:string;
        status:string;
    }
    


    export async function addAsset(asset:Asset) {
    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/add-assets`, {
        method: "POST",
       headers: {
            Cookie: cookie ?? "",
          },
          cache: "no-store",
          body: JSON.stringify(asset),
        });
      let data = null;
      try {
        data = await res.json();
        revalidatePath("/admin")
      } catch {
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
     revalidatePath("/admin")
  } catch {
    console.warn("No JSON returned");
    return { success: false };
  }

  return data;
}

export async function updateAsset(assetId: string,updates:{label:string, status:string, imageUrl:string | undefined,  quantity: number, availableQuantity: number}) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/update-asset/${assetId}`, {
    method: "PATCH",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
      body: JSON.stringify(updates),
    });

  let data = null;
  try {
    data = await res.json();
    revalidatePath("/admin")
  } catch {
    console.warn("No JSON returned");
    return { success: false };
  }

  return data;
}


export async function deleteAsset(assetId: string) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/delete-asset/${assetId}`, {
    method: "DELETE",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
    });

  let data = null;
  try {
    data = await res.json();
     revalidatePath("/admin")
  } catch {
    console.warn("No JSON returned");
    return { success: false };
  }
  return data;
}

export async function deleteAssetType(typeId: string) {
    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/delete-type/${typeId}`, {
    method: "DELETE",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
    });

  let data = null;
  try {
    data = await res.json();
    revalidatePath("/admin")
  } catch {
    console.warn("No JSON returned");
    return { success: false };
  }
  return data;
}



