"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const checkToken = () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return setIsLoggedIn(false);

      try {
        const payload = JSON.parse(
          atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        const now = Math.floor(Date.now() / 1000);
        if (payload?.exp && payload.exp > now) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("auth_token");
          setIsLoggedIn(false);
        }
      } catch {
        localStorage.removeItem("auth_token");
        setIsLoggedIn(false);
      }
    };

    checkToken();

    window.addEventListener("auth-change", checkToken);
    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("auth-change", checkToken);
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMainButtonClick = () => {
    if (isLoggedIn) router.push("/dashboard");
    else router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div ref={menuRef}>
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <Link href="/">
            <Image
              src="/mlogo.png"
              alt="MM Miles Logo"
              width={110}
              height={33}
              priority
            />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <ul className="navLinks">
          <li><Link href="/about">About Us</Link></li>
          <li><Link href="/reviews">Reviews</Link></li>
          <li><Link href="/faq">FAQ&apos;s</Link></li>
          <li><Link href="/contact">Contact Us</Link></li>
        </ul>

        {/* Login/Dashboard Button */}
        <button className="loginBtn" onClick={handleMainButtonClick}>
          {isLoggedIn ? "Dashboard" : "Login / Signup"}
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="mobileMenu"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </nav>

      {/* Mobile Dropdown with Animation */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="backdrop"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="mobileDropdown"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.12 },
                  },
                }}
              >
                {[
                  { name: "About Us", link: "/about" },
                  { name: "Reviews", link: "/reviews" },
                  { name: "FAQ's", link: "/faq" },
                  { name: "Contact Us", link: "/contact" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{
                      
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link href={item.link} onClick={() => setMenuOpen(false)}>
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.button
                className="dropdownLogin"
                onClick={() => {
                  handleMainButtonClick();
                  setMenuOpen(false);
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#D8B480",
                  color: "#111",
                }}
                transition={{ duration: 0.3 }}
              >
                {isLoggedIn ? "Dashboard" : "Login / Signup"}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
