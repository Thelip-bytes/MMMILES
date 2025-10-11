"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter(); // <-- Add router

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <Link href="/">
            <Image
              src="/goldlogo.png"
              alt="Urban Drive"
              fill
              className="logoImg"
              priority
            />
          </Link>
        </div>

        <ul className="navLinks">
          <Link href="/about">About us</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="#faq-navigation">FAQ's</Link>
          <Link href="/contact">Contact us</Link>
          
        </ul>

        {/* Updated Login Button */}
        <button
          className="loginBtn"
          onClick={() => router.push("/login")}
        >
          Login/Signup
        </button>

        <button
          className="mobileMenu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </nav>

      {/* Backdrop */}
      {menuOpen && (
        <div className="backdrop" onClick={() => setMenuOpen(false)} />
      )}

      {/* Dropdown */}
      <div
        ref={menuRef}
        className={`mobileDropdown ${menuOpen ? "dropdownOpen" : "dropdownClosed"}`}
      >
        <ul>
          <li>About Us</li>
          <li>Reviews</li>
          <li>FAQ’s</li>
          <li>Contact Us</li>
        </ul>

        {/* Updated Dropdown Login Button */}
        <button
          className="dropdownLogin"
          onClick={() => {
            setMenuOpen(false);  // closes menu
            router.push("/login"); // navigates to login
          }}
        >
          Login/Signup
        </button>
      </div>
    </div>
  );
}
