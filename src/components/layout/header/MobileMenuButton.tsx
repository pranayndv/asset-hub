"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

import {
  HomeIcon,
  CubeIcon,
  InformationCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

interface Props {
  session: Session | null;
}

export default function MobileMenuButton({ session }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>

      <button
        className="md:hidden p-2 rounded-xl hover:bg-gray-200/50 active:scale-95 transition-all duration-200 flex justify-center items-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <svg className="h-7 w-7 text-gray-900" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-7 w-7 text-gray-900" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>


      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 md:hidden z-40"
        />
      )}


      <nav
        className={`md:hidden fixed top-16 left-0 right-0 bg-white backdrop-blur-xl rounded-b-2xl shadow-xl border-t border-gray-200/50 overflow-hidden z-50 transition-all duration-300 ease-in-out ${isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-7 py-6 space-y-4 text-base text-gray-800">
          
          <MobileLink
            icon={<HomeIcon className="h-5 w-5" />}
            href="/"
            label="Home"
            closeMenu={closeMenu}
          />

          <MobileLink
            icon={<CubeIcon className="h-5 w-5" />}
            href="/asset-types"
            label="Assets"
            closeMenu={closeMenu}
          />

          <MobileLink
            icon={<InformationCircleIcon className="h-5 w-5" />}
            href="/about"
            label="About"
            closeMenu={closeMenu}
          />

          

          {!session ? (
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex items-center gap-3 w-full text-center py-3 px-4 mt-2 font-semibold rounded-xl bg-linear-to-r from-gray-900 to-gray-700 text-white shadow-md hover:opacity-90 transition-all"
            >
              <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
              Login
            </Link>
          ) : (
            <>
              <MobileLink
                icon={<Squares2X2Icon className="h-5 w-5" />}
                href={`${
                    session.user.role == "EMPLOYEE"? 
                    "/employee":
                    session.user.role == "ADMIN" ?
                    "/admin":
                    session.user.role == "MANAGER"?
                    "/manager":""
                    }`}
                label="Dashboard"
                closeMenu={closeMenu}
              />

              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 w-full py-3 px-4 mt-2 rounded-xl bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition-all"
              >
                <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}


function MobileLink({
  href,
  label,
  icon,
  closeMenu,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  closeMenu: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={closeMenu}
      className="flex items-center gap-3 py-2 text-gray-700 text-[15px] font-medium tracking-wide hover:text-gray-900 hover:translate-x-1 transition-all duration-200"
    >
      {icon}
      {label}
    </Link>
  );
}
