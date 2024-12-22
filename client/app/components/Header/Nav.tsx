import Link from "next/link";
import React, { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  FolderIcon,
  PhoneIcon,
  ChartBarIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";

function Nav() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { isSignedIn } = useUser();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMouseEnter = (link: string) => setHoveredLink(link);
  const handleMouseLeave = () => setHoveredLink(null);

  return (
    <>
      <div className="h-[12vh] bg-gray-950 w-full rounded-b-3xl px-6 lg:px-8 bg-opacity-40 mt-1 backdrop-blur-xl shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between w-full h-full">
          <div className="flex items-center space-x-2">
            <h1 className="text-[18px] md:text-[24px] font-bold text-slate-300">
              <span className="text-[30px] md:text-[40px] text-teal-400">
                L
              </span>
              earnovix
            </h1>
          </div>

          <div
            className="hidden md:flex flex-1 justify-center space-x-16 items-center relative"
            onMouseLeave={handleMouseLeave}
          >
            {[
              { name: "Home", href: "/", icon: HomeIcon },
              { name: "Explorer", href: "/explorer", icon: UserIcon },
              { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
              { name: "Feed", href: "/feed", icon: NewspaperIcon },
            ].map((item) => (
              <div
                key={item.name}
                onMouseEnter={() => handleMouseEnter(item.name)}
                className="relative flex items-center space-x-2"
              >
                <item.icon className="w-5 h-5 text-slate-300" />
                <Link
                  href={item.href}
                  className="text-slate-300 hover:text-white transition duration-300 text-lg md:text-xl"
                >
                  {item.name}
                </Link>
              </div>
            ))}

            {/* Show Sign In / Sign Up if NOT signed in */}
            {!isSignedIn ? (
              <>
                <Link href="/sign-in" className="text-slate-300">
                  Sign In
                </Link>
                <Link href="/sign-up" className="text-slate-300">
                  Sign Up
                </Link>
              </>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}

            <motion.div
              className="absolute bottom-[-15px] left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-teal-300 to-transparent"
              initial={{ x: "-100%" }}
              animate={{
                x: hoveredLink
                  ? `${
                      ["Home", "Explorer", "Dashboard", "Feed"].indexOf(
                        hoveredLink
                      ) * 20
                    }%`
                  : "-100%",
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-slate-300 hover:text-white"
              aria-label="Toggle Mobile Menu"
              aria-expanded={isMobileMenuOpen ? "true" : "false"}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-8 h-8" />
              ) : (
                <Bars3Icon className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-[14vh]"></div>

      {/* Mobile Nav */}
      <nav
        className={`md:hidden fixed top-0 left-0 h-full w-[60%] bg-purple-300 bg-opacity-90 backdrop-blur-xl p-6 shadow-lg transition-transform duration-300 ease-in-out transform z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="space-y-4 mt-8">
          {[
            { name: "Home", href: "/", icon: HomeIcon },
            { name: "Explorer", href: "/explorer", icon: UserIcon },
            { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
            { name: "Feed", href: "/feed", icon: NewspaperIcon },
          ].map((item) => (
            <li
              key={item.name}
              className="flex items-center space-x-2"
              onClick={toggleMobileMenu}
            >
              <item.icon className="w-5 h-5 text-slate-300" />
              <Link
                href={item.href}
                className="text-slate-300 hover:text-white block"
              >
                {item.name}
              </Link>
            </li>
          ))}

          {/* Conditionally Show Sign In / Sign Up */}
          {!isSignedIn ? (
            <>
              <li>
                <Link href="/sign-in" className="text-slate-300">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="text-slate-300">
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <li>
              <UserButton afterSignOutUrl="/" />
            </li>
          )}
        </ul>
      </nav>

      {isMobileMenuOpen && (
        <div
          onClick={toggleMobileMenu}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out z-40"
        />
      )}
    </>
  );
}

export default Nav;
