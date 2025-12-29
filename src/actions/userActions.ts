"use server"
import { authOptions } from "@/lib/auth/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";


interface User{
    name: string;
    email: string;

}




export async function getSession() {
  const session = await getServerSession(authOptions);
  return session
}


export async function createEmployee(user: User) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/create-employee`, {
    method: "POST",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
      body: JSON.stringify(user),
    });

  let data = null;
  try {
    data = await res.json();
     revalidatePath("/manager")
  } catch {
    return { success: false };
  }

  return data;
}


export async function getEmployee() {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/get-employee`, {
    method: "GET",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
    });

  let data = null;
  try {
    revalidatePath("/manager")
    revalidatePath("/admin")
    data = await res.json();
  } catch {
    return { success: false };
  }

  return data;
}



export async function updateEmployee(employeeId: string, updates: { name?: string; email?: string }) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/handle-employee/${employeeId}`, {
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
      revalidatePath("/manager")
    revalidatePath("/admin")
  } catch {
    return { success: false };
  }

  return data;
}




export async function changeProfile(formData : unknown) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/update-profile`, {
    method: "PATCH",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
      body: JSON.stringify(formData),
    });

  let data = null;
  try {
    data = await res.json();
        revalidatePath("/employee")
    revalidatePath("/manager")
    revalidatePath("/admin")
  } catch {
    return { success: false };
  }

  return data;
}


export async function deleteEmployee(employeeId: string) {

    const headersList = await headers();
    const cookie = await headersList.get("cookie");
  

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/handle-employee/${employeeId}`, {
    method: "DELETE",
   headers: {
        Cookie: cookie ?? "",
      },
      cache: "no-store",
    });

  let data = null;
  try {
    data = await res.json();
    revalidatePath("/manager")
    revalidatePath("/admin")
  } catch {
    return { success: false };
  }

  return data;
}