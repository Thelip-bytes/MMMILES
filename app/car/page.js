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
      <section style={{ maxWidth: "900px", marginTop: "24px" }}>
      <h2>Self Drive Car Rentals in Chennai</h2>

      <p>
        MM Miles offers reliable and affordable self drive car rentals in Chennai
        for professionals, families, and travelers. Choose from hatchbacks,
        sedans, and premium SUVs with transparent pricing and instant online booking.
      </p>

      <p>
        Whether you need a car for daily commute, weekend trips, airport travel,
        or long-term rental, MM Miles gives you complete flexibility without the
        burden of ownership.
      </p>

      <h3>Why choose MM Miles?</h3>
      <ul>
        <li>Wide range of self drive cars available across Chennai</li>
        <li>Simple booking through our website</li>
        <li>No hidden charges or surge pricing</li>
        <li>Well-maintained vehicles with regular servicing</li>
        <li>24/7 customer support for complete peace of mind</li>
      </ul>

      <p>
        Browse available cars below and book your self drive car in Chennai
        in just a few clicks.
      </p>
    </section>

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







      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is self drive car rental available in Chennai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, MM Miles offers self drive car rentals across Chennai with flexible booking options and transparent pricing."
          }
        },
        {
          "@type": "Question",
          "name": "What documents are required to rent a car from MM Miles?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You need a valid driving license and a government-issued ID to book a self drive car with MM Miles."
          }
        },
        {
          "@type": "Question",
          "name": "Is fuel included in the car rental price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fuel is not included in the rental price. The car must be returned with the same fuel level as at pickup."
          }
        },
        {
          "@type": "Question",
          "name": "Is insurance included?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, insurance is included. Deductibles depend on the protection plan selected."
          }
        },
        {
          "@type": "Question",
          "name": "Do you provide 24/7 customer support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, MM Miles provides 24/7 customer support to ensure a smooth and hassle-free rental experience."
          }
        }
      ]
    })
  }}
/>










      
    </main>
  );
}
