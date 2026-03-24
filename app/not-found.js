import Link from "next/link";

/* ============================================================
   CUSTOM 404 PAGE
   - noindex prevents 404 pages from appearing in Google
   - Links back to important pages to preserve crawl equity
   ============================================================ */

export const metadata = {
  title: "Page Not Found | MM Miles",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,   // never index 404 pages
    follow: true,   // still follow links on this page
  },
};

export default function NotFound() {
  return (
    <main style={{ padding: "80px 20px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>404</h1>
      <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 16 }}>Page Not Found</h2>
      <p style={{ color: "#555", marginBottom: 32, fontSize: 16 }}>
        The page you are looking for does not exist or has been moved.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          href="/"
          style={{ background: "#000", color: "#fff", padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}
        >
          Go Home
        </Link>
        <Link
          href="/car"
          style={{ border: "1px solid #ddd", color: "#333", padding: "10px 24px", borderRadius: 8, textDecoration: "none" }}
        >
          Browse Cars
        </Link>
        <Link
          href="/car/chennai"
          style={{ border: "1px solid #ddd", color: "#333", padding: "10px 24px", borderRadius: 8, textDecoration: "none" }}
        >
          Chennai Rentals
        </Link>
      </div>

      <div style={{ marginTop: 48 }}>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Popular pages:</p>
        <ul style={{ listStyle: "none", padding: 0, lineHeight: 2.2 }}>
          <li><Link href="/car/chennai">Self Drive Car Rental Chennai</Link></li>
          <li><Link href="/rent/toyota-fortuner">Toyota Fortuner Rental Chennai</Link></li>
          <li><Link href="/rent/innova-crysta">Innova Crysta Rental Chennai</Link></li>
          <li><Link href="/cities/chennai/omr">Car Rental OMR Chennai</Link></li>
          <li><Link href="/cities/chennai/velachery">Car Rental Velachery Chennai</Link></li>
          <li><Link href="/faq">FAQs</Link></li>
          <li><Link href="/contact">Contact Us</Link></li>
        </ul>
      </div>
    </main>
  );
}
