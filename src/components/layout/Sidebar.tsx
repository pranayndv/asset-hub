import Link from "next/link";
import { ReactNode } from "react";

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
}

interface ResponsiveNavProps {
  title: string;
  items: NavItem[];
  active: string;
}

export default function Sidebar({
  title,
  items,
  active,
}: ResponsiveNavProps) {
  return (
    <>
      <aside
        className="
          hidden lg:flex flex-col w-64 bg-gray-900 text-white p-5 pt-7
          fixed left-0 top-0 h-screen
        "
      >
        <h2 className="text-xl font-bold mb-6">{title}</h2>

        <ul className="space-y-3">
          {items.map((item) => {
            const isActive = active === item.id;

            return (
              <li key={item.id}>
                <Link
                
                  href={item.href ?? `?tab=${item.id}`}
                  className={`
                    flex items-center gap-3 w-full p-2 rounded-md transition
                    ${
                      isActive
                        ? "bg-gray-400/50 text-white"
                        : "hover:bg-gray-700"
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <nav
        className="
          lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2
          w-full bg-white/90 backdrop-blur-lg
          border border-gray-200 shadow-xl
          rounded-t-2xl z-40
        "
      >
        <ul className="flex justify-around py-3">
          {items.map((item) => {
            const isActive = active === item.id;

            return (
              <li key={item.id}>
                <Link
                  href={item.href ?? `?tab=${item.id}`}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`
                      text-xl transition-all duration-300
                      ${
                        isActive
                          ? "text-blue-600 scale-110"
                          : "text-gray-500"
                      }
                    `}
                  >
                    {item.icon}
                  </div>

                  <span
                    className={`
                      text-[10px] font-medium
                      ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-500"
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
