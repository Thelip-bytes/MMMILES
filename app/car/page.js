// app/car/page.js

export const dynamic = "force-static";

/* =========================
   SEO METADATA
========================= */
export const metadata = {
  title: "Self Drive Car Rentals in Chennai | MM Miles",
  description:
    "Book self drive cars in Chennai with MM Miles. Choose from hatchbacks, sedans and SUVs with transparent pricing, flexible rentals and 24/7 support.",
  alternates: {
    canonical: "https://www.mmmiles.com/car",
  },
  openGraph: {
    title: "Self Drive Car Rentals in Chennai | MM Miles",
    description:
      "Affordable self drive car rentals in Chennai with flexible booking and premium cars.",
    url: "https://www.mmmiles.com/car",
    siteName: "MM Miles",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/mmmiles-og.jpg",
        width: 1200,
        height: 630,
        alt: "MM Miles – Self Drive Cars in Chennai",
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
          PRIMARY H1
      ========================= */}
      <h1>Available Self Drive Cars in Chennai</h1>

      {/* =========================
          INTRO (CRITICAL)
      ========================= */}
      <p>
        MM Miles offers trusted and affordable{" "}
        <strong>self drive car rentals in Chennai</strong>.
        Rent hatchbacks, sedans, and SUVs for city travel, weekend trips,
        airport runs, or long-term needs with transparent pricing and easy booking.
      </p>

      {/* =========================
          INTERNAL LINKING (STEP 2)
      ========================= */}
      <section style={{ marginTop: "24px" }}>
        <p>
          Learn more <a href="/about">about MM Miles</a> and how we make car rentals
          simple and reliable across Chennai.
        </p>

        <p>
          Have questions? Visit our <a href="/faq">car rental FAQs</a> or
          <a href="/contact"> contact our support team</a> for quick assistance.
        </p>
      </section>

      {/* =========================
          SERVICES SECTION
      ========================= */}
      <section style={{ marginTop: "32px" }}>
        <h2>Car Rental Services in Chennai</h2>
        <p>
          Our self drive car rental services are designed for professionals,
          families, and travelers who want flexibility without ownership.
          All vehicles are well-maintained and supported by 24/7 customer care.
        </p>

        <ul>
          <li>Self drive cars for daily office commute</li>
          <li>Weekend and holiday travel rentals</li>
          <li>Airport pickup and drop car rentals</li>
          <li>Long-term monthly car rental plans</li>
        </ul>
      </section>

      {/* =========================
          WHY MM MILES
      ========================= */}
      <section style={{ marginTop: "32px" }}>
        <h2>Why Choose MM Miles?</h2>
        <ul>
          <li>No hidden charges or surge pricing</li>
          <li>Flexible hourly, daily, and monthly rentals</li>
          <li>Wide range of self drive cars</li>
          <li>Instant online booking</li>
          <li>24/7 roadside & customer support</li>
        </ul>
      </section>

      {/* =========================
          LOCATION RELEVANCE
      ========================= */}
      <section style={{ marginTop: "32px" }}>
        <h2>Self Drive Cars Available Across Chennai</h2>
        <p>
          MM Miles operates across major areas including Anna Nagar, OMR,
          Velachery, Tambaram, and surrounding locations—ensuring easy access
          wherever you are in Chennai.
        </p>
      </section>

      {/* =========================
          FAQ SCHEMA (RICH RESULTS)
      ========================= */}
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
                  "text":
                    "Yes, MM Miles offers self drive car rentals across Chennai with flexible booking options."
                }
              },
              {
                "@type": "Question",
                "name": "What documents are required to rent a car?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "A valid driving license and government-issued ID are required."
                }
              },
              {
                "@type": "Question",
                "name": "Is fuel included in the rental price?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Fuel is not included. Cars must be returned with the same fuel level."
                }
              },
              {
                "@type": "Question",
                "name": "Is insurance included?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Yes, insurance is included. Deductibles depend on the selected plan."
                }
              },
              {
                "@type": "Question",
                "name": "Do you provide 24/7 support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Yes, MM Miles provides 24/7 customer and roadside support."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}
