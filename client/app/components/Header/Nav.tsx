import Link from "next/link";
import React, { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  ChartBarIcon,
  NewspaperIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { UserButton, useUser } from "@clerk/nextjs";

function Nav() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMouseEnter = (link: string) => setHoveredLink(link);
  const handleMouseLeave = () => setHoveredLink(null);

  const AuthButtons = () => {
    if (isSignedIn) {
      return <UserButton afterSignOutUrl="/" />;
    }

    return (
      <>
        <Link href="/auth/sign-in" className="text-slate-300 hover:text-white">
          Sign In
        </Link>
        <Link href="/auth/sign-up" className="text-slate-300 hover:text-white">
          Sign Up
        </Link>
      </>
    );
  };

  const MobileAuthButtons = () => {
    if (isSignedIn) {
      return (
        <li className="flex items-center space-x-2 text-slate-300">
          <UserButton afterSignOutUrl="/" />
        </li>
      );
    }

    return (
      <>
        <li>
          <Link
            href="/auth/sign-in"
            className="text-slate-300 hover:text-white block"
          >
            Sign In
          </Link>
        </li>
        <li>
          <Link
            href="/auth/sign-up"
            className="text-slate-300 hover:text-white block"
          >
            Sign Up
          </Link>
        </li>
      </>
    );
  };

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

            <AuthButtons />
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

      {/* Mobile Menu */}
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
          <MobileAuthButtons />
        </ul>
      </nav>

      {/* Backdrop for Mobile Menu */}
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
