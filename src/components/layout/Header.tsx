import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import MobileMenuButton from "./header/MobileMenuButton";
import { getSession } from "@/actions/userActions";


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/asset-types", label: "Assets" },
  { href: "/about", label: "About" },
];

export default async function Header() {
  const session: Session | null = await getSession()
 
  return (
    <header 
      className="
        fixed w-full top-0 z-50 
        bg-white backdrop-blur-lg 
        border-b border-gray-200/60 
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
          >
            <svg width="35px" height="66px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g transform="translate(2.000000, 4.000000)" fill="#4285F4"> <polygon id="Fill-1" points="12.114144 0 11.139744 0.9744 18.228504 8.04552 12.114144 14.15988 6.000624 8.04552 8.920464 5.124 7.955304 4.15968 4.069464 8.04552 12.114144 16.09104 20.160504 8.04552"> </polygon> <polygon id="Fill-2" points="10.122672 9.813216 8.355312 8.045856 10.122672 6.277656 11.890032 8.045856"> </polygon> <polygon id="Fill-3" points="8.045352 0 -0.000168 8.04552 8.045352 16.09104 9.008832 15.12672 1.930992 8.04552 8.045352 1.93116 14.158872 8.04552 11.239032 10.9662 12.205032 11.9322 16.090872 8.04552"> </polygon> </g> </g> </g></svg>
           <span className="font-bold text-3xl tracking-wide">
            Asset<span className="text-blue-500">Hub</span>
          </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="
                  text-gray-700 hover:text-gray-900 
                  transition-all duration-200
                "
              >
                {label}
              </Link>
            ))}

            {!session ? (
              <Link
                href="/login"
                className="
                  px-5 py-2 rounded-md
                  text-white text-sm font-medium
                  bg-black border-2 border-gray-300
                  hover:opacity-90 transition-all shadow-md
                "
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-4">

                <Link
                  href={`${
                    session.user.role == "EMPLOYEE"? 
                    "/employee":
                    session.user.role == "ADMIN" ?
                    "/admin":
                    session.user.role == "MANAGER"?
                    "/manager":""
                    }`}
                  className="
                    text-gray-700 hover:text-gray-900 
                    transition-all duration-200
                  "
                >
                  Dashboard
                </Link>


                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    className="
                      w-11 h-11 rounded-full overflow-hidden
                      flex items-center justify-center
                      shadow-inner border border-gray-300/70
                      ring-2 ring-blue-400 transition-all duration-300
                    "
                  >
                    {session.user?.profileImage ? (
                      <Image
                        src={session.user.profileImage}
                        width={44}
                        height={44}
                        alt="Profile"
                        className="rounded-full object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-gray-700">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </Link>

                </div>
              </div>
            )}
          </nav>

          {/* Mobile Section */}
          <div className="flex md:hidden items-center gap-4">

            {session && (
              <Link
                href="/profile"
                className="
                  w-10 h-10 rounded-full overflow-hidden
                  flex items-center justify-center
                  border border-gray-300/70 shadow-inner
                  hover:ring-2 ring-blue-400 transition-all
                "
              >
                {session.user?.profileImage ? (
                  <Image
                    src={session.user.profileImage}
                    width={40}
                    height={40}
                    alt="Profile"
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <span className="font-semibold text-gray-700 text-lg">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </Link>
            )}

            <MobileMenuButton session={session} />
          </div>

        </div>
      </div>
    </header>
  );
}
