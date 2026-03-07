"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { IoIosGlobe } from "react-icons/io";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const menus = [
  { label: "Home",         href: "/"             },
  { label: "Destinos",     href: "/destinations" },
  { label: "DiscoveryMap", href: "/dashboard"    },
  
];

export default function TripHeader() {
  const pathname = usePathname();

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 md:px-10">
      {/* Logo + Menu alineados a la izquierda */}
      <div className="flex items-center gap-180">
        <div className="flex items-center gap-2 font-medium tracking-[4px] text-gray-800 text-xs uppercase">
          <IoIosGlobe className="text-xl text-blue-500" />
          Bon Voyage
        </div>

        <ul className="flex items-center gap-6 text-[11px] font-medium uppercase text-gray-600">
          {menus.map(({ label, href }) => (
            <motion.li layout key={href}>
              <Link
                href={href}
                className={`inline-block pb-0.5 transition-colors ${
                  pathname === href
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "hover:border-b-2 hover:border-blue-400 hover:text-blue-500"
                }`}
              >
                {label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Right side: user */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-3 py-1 rounded border border-gray-400 text-gray-700 text-xs hover:bg-gray-100 transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Link
                label="Mis viajes"
                labelIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>}
                href="/my-trips"
              />
              <UserButton.Link
                label="Favoritos"
                labelIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>}
                href="/favorites"
              />
              <UserButton.Link
                label="Wishlist"
                labelIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" /></svg>}
                href="/wishlist"
              />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>
      </div>
    </header>
  );
}
