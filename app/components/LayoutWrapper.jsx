"use client";

import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }) {

  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/host-registration") ||
    pathname.startsWith("/host-registration-form");

  const hideFooter =
    
    pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNavbar && <Navbar />}

      {children}

      {!hideFooter && <Footer />}
    </>
  );
}