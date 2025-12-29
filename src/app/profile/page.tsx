

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import Link from "next/link";
import ProfileImageModal from "./components/ProfileImageModal";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { EnvelopeIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { logout } from "./components/LogoutFn";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] px-4">
        <p className="text-gray-600 text-lg text-center">Unauthorized</p>
      </div>
    );
  }

  const { name, email, role } = session.user as {
    name: string;
    email: string;
    role: string;
    profileImage?: string;
  };



  return (
    <div className="flex justify-center items-center min-h-[90vh] py-6 px-4 bg-linear-to-b from-gray-100 to-gray-200">
      <div className="backdrop-blur-xl bg-white/80 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 p-7 sm:p-9">

        <div className="flex flex-col items-center">
          <ProfileImageModal session={session} currentImage={session.user.profileImage || "/images/avatar.png"}>
            <div />
          </ProfileImageModal>

          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-gray-800 text-center tracking-tight">
            {name}
          </h2>

          <p className="text-gray-500 text-sm sm:text-base flex items-center gap-1 mt-1">
            <EnvelopeIcon className="h-4 w-4 text-gray-400" />
            {email}
          </p>

          <span className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
            <ShieldCheckIcon className="h-4 w-4" />
            {role}
          </span>
        </div>

    
        <div className="mt-8 rounded-xl bg-gray-50 p-5 shadow-inner border border-gray-200 space-y-3">
          <h3 className="text-gray-800 font-semibold text-lg">Details</h3>

          <div className="flex items-center justify-between text-gray-700">
            <span className="font-medium">Email</span>
            <span className="text-gray-500">{email}</span>
          </div>

          <div className="h-px bg-gray-200 w-full"></div>

          <div className="flex items-center justify-between text-gray-700">
            <span className="font-medium">Role</span>
            <span className="text-gray-500">{role}</span>
          </div>
        </div>

     
        <div className="mt-8 flex flex-col gap-4">

          <button
            onClick={logout}
            className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 hover:shadow-lg transition-all"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>

    
          <Link
            href="/forgot-password"
            className="w-full py-3 text-center rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md hover:opacity-90 transition-all"
          >
            Change Password
          </Link>
        </div>

      </div>
    </div>
  );
}


