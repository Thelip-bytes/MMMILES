// app/car/page.js

export const dynamic = "force-static";

/* =========================
   SEO METADATA (VERY IMPORTANT)
========================= */
export const metadata = {
  title: "Self Drive Car Rentals in Chennai | MM Miles",
  description:
    "Browse and book self drive cars in Chennai with MM Miles. Choose from hatchbacks, sedans and SUVs with transparent pricing, easy online booking and 24/7 customer support.",
  alternates: {
    canonical: "https://www.mmmiles.com/car",
  },
  openGraph: {
    title: "Self Drive Car Rentals in Chennai | MM Miles",
    description:
      "Affordable self drive car rentals in Chennai. Flexible bookings, premium cars and 24/7 support.",
    url: "https://www.mmmiles.com/car",
    siteName: "MM Miles",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/mmmiles-og.jpg",
        width: 1200,
        height: 630,
        alt: "MM Miles Self Drive Cars in Chennai",
      },
    ],
  },
};

/* =========================
   PAGE COMPONENT
========================= */
export default function CarsPage() {
  return (
    <main style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* =========================
          H1 — DO NOT CHANGE
      ========================= */}
      <h1>Available Self Drive Cars in Chennai</h1>

      {/* =========================
          SEO INTRO PARAGRAPH
      ========================= */}
      <p>
        MM Miles offers reliable and affordable <strong>self drive car rentals in Chennai</strong>.
        Browse from a wide range of hatchbacks, sedans and SUVs suited for city travel,
        weekend trips and long drives. With transparent pricing, easy online booking and
        24/7 customer support, renting a car has never been easier.
      </p>

      {/* =========================
          SEO CONTENT BLOCK (RANKING BOOST)
      ========================= */}
      <section style={{ marginTop: "30px" }}>
        <h2>Why Choose MM Miles for Self Drive Car Rental?</h2>
        <ul>
          <li>Wide range of well-maintained cars</li>
          <li>No hidden charges or surprise fees</li>
          <li>Instant online booking through our website</li>
          <li>Flexible hourly and daily rental plans</li>
          <li>24/7 customer support for peace of mind</li>
        </ul>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2>Self Drive Cars Available Across Chennai</h2>
        <p>
          Our self drive cars are available across major areas including Anna Nagar,
          OMR, Velachery, Tambaram and surrounding locations. Whether you need a car
          for work, travel or leisure, MM Miles ensures a smooth and hassle-free experience.
        </p>
      </section>

      
    </main>
  );
}
