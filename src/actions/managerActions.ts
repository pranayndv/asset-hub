"use server"
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";



interface User{
    name: string;
    email: string;
}

    export async function createManager(type:User) {
    const headersList = await headers();
    const cookie = await headersList.get("cookie");
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/manager/create`, {
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


    export async function updateManager(managerId: string, updates: { name?: string; email?: string }) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/manager/${managerId}/edit`, {
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
    return { success: false };
  }

  return data;
}


export async function deleteManager(managerId: string) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/manager/delete/${managerId}`, {
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
    return { success: false };
  }

  return data;
}


    export async function transferEmployee(updates:{employeeIds:string[],targetManagerId:string}) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/manager/transfer`, {
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
     revalidatePath("/employee")
      revalidatePath("/admin")
  } catch {
    return { success: false };
  }

  return data;
}