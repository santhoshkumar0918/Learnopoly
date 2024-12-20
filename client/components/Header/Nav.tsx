import Link from "next/link";
import React, { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  FolderIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

function Nav() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMouseEnter = (link: string) => setHoveredLink(link);
  const handleMouseLeave = () => setHoveredLink(null);

  return (
    <>
      {/* Navigation Bar */}
      <div className="h-[12vh] bg-gray-950 w-full rounded-b-3xl px-6 lg:px-8 bg-opacity-40 mt-1 backdrop-blur-xl shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between w-full h-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <h1 className="text-[18px] md:text-[24px] font-bold text-slate-300">
              <span className="text-[30px] md:text-[40px] text-teal-400">
                L
              </span>
              earnovix
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div
            className="hidden md:flex flex-1 justify-center space-x-24 items-center relative"
            onMouseLeave={handleMouseLeave}
          >
            <div
              onMouseEnter={() => handleMouseEnter("home")}
              className="relative flex items-center space-x-2"
            >
              <HomeIcon className="w-5 h-5 text-slate-300" />
              <Link
                href="/"
                className="text-slate-300 hover:text-white transition duration-300 text-lg md:text-xl"
              >
                Home
              </Link>
            </div>

            <div
              onMouseEnter={() => handleMouseEnter("about")}
              className="relative flex items-center space-x-2"
            >
              <UserIcon className="w-5 h-5 text-slate-300" />
              <Link
                href="/about"
                className="text-slate-300 hover:text-white transition duration-300 text-lg md:text-xl"
              >
                Explorer
              </Link>
            </div>

            <div
              onMouseEnter={() => handleMouseEnter("projects")}
              className="relative flex items-center space-x-2"
            >
              <FolderIcon className="w-5 h-5 text-slate-300" />
              <Link
                href="/sign-in"
                className="text-slate-300 hover:text-white transition duration-300 text-lg md:text-xl"
              >
                SignIn
              </Link>
            </div>

            <div
              onMouseEnter={() => handleMouseEnter("contacts")}
              className="relative flex items-center space-x-2"
            >
              <PhoneIcon className="w-5 h-5 text-slate-300" />
              <Link
                href="/sign-up"
                className="text-slate-300 hover:text-white transition duration-300 text-lg md:text-xl"
              >
                SignUp
              </Link>
            </div>

            {/* Hover Animation */}
            <motion.div
              className="absolute bottom-[-15px] left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-teal-300 to-transparent"
              initial={{ x: "-100%" }}
              animate={{
                x:
                  hoveredLink === "home"
                    ? "-25%"
                    : hoveredLink === "about"
                    ? "0%"
                    : hoveredLink === "projects"
                    ? "25%"
                    : hoveredLink === "contacts"
                    ? "50%"
                    : "-100%",
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Navigation Links */}
      <nav
        className={`md:hidden fixed top-0 left-0 h-full w-[60%] bg-purple-300 bg-opacity-90 backdrop-blur-xl p-6 shadow-lg transition-transform duration-300 ease-in-out transform z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="space-y-4 mt-8">
          <li className="flex items-center space-x-2">
            <HomeIcon className="w-5 h-5 text-slate-300" />
            <Link
              href="/"
              onClick={toggleMobileMenu}
              className="text-slate-300 hover:text-white block"
            >
              Home
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5 text-slate-300" />
            <Link
              href="/about"
              onClick={toggleMobileMenu}
              className="text-slate-300 hover:text-white block"
            >
              About
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <FolderIcon className="w-5 h-5 text-slate-300" />
            <Link
              href="/sign-up"
              onClick={toggleMobileMenu}
              className="text-slate-300 hover:text-white block"
            >
              sign-up
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <PhoneIcon className="w-5 h-5 text-slate-300" />
            <Link
              href="/sign-in"
              onClick={toggleMobileMenu}
              className="text-slate-300 hover:text-white block"
            >
              signin
            </Link>
          </li>
        </ul>
      </nav>

      {/* Background overlay */}
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
