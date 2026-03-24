import Link from "next/link";
import { notFound } from "next/navigation";
import { cars, getCarBySlug } from "@/lib/cars";
import { getActiveCities } from "@/lib/cities";

export async function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }) {
  const p = await params;
  const car = getCarBySlug(p.slug);
  if (!car) return { title: "Not Found" };
  return {
    title: `${car.name} Self Drive Rental in Chennai | No Deposit | MM Miles`,
    description: `Rent ${car.name} for self drive from ₹${car.pricePerDay}/day. Zero deposit, unlimited km, fully insured, home delivery. Book in 2 minutes!`,
    keywords: [`${car.name} rental Chennai`, `${car.name} self drive Chennai`, `rent ${car.name} Chennai`].join(", "),
    alternates: { canonical: `https://www.mmmiles.com/rent/${car.slug}` },
    openGraph: {
      title: `${car.name} Self Drive Rental | MM Miles`,
      description: `Rent ${car.name}. Zero deposit, unlimited km. Book now!`,
      url: `https://www.mmmiles.com/rent/${car.slug}`,
    },
  };
}

export default async function RentPage({ params }) {
  const p = await params;
  const car = getCarBySlug(p.slug);
  if (!car) notFound();

  const cities = getActiveCities();
  const relatedCars = cars.filter((c) => c.type === car.type && c.slug !== car.slug).slice(0, 6);

  const schemas = [
    {
      "@context": "https://schema.org", "@type": "Product",
      name: `${car.name} Self Drive Rental`,
      description: car.description,
      brand: { "@type": "Brand", name: "MM Miles" },
      offers: { "@type": "AggregateOffer", lowPrice: car.pricePerHour, highPrice: car.pricePerDay, priceCurrency: "INR", availability: "https://schema.org/InStock", seller: { "@type": "Organization", name: "MM Miles" } },
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: `What is the price to rent ${car.name}?`, acceptedAnswer: { "@type": "Answer", text: `₹${car.pricePerHour}/hour or ₹${car.pricePerDay}/day. No security deposit required.` } },
        { "@type": "Question", name: `Is there a security deposit for ${car.name} rental?`, acceptedAnswer: { "@type": "Answer", text: `No. MM Miles charges zero security deposit.` } },
        { "@type": "Question", name: `Does ${car.name} rental include unlimited km?`, acceptedAnswer: { "@type": "Answer", text: `Yes. All rentals include unlimited km — drive anywhere without extra charges.` } },
        { "@type": "Question", name: `Can I get ${car.name} home delivered?`, acceptedAnswer: { "@type": "Answer", text: `Yes. We deliver across all Chennai, Coimbatore and Bangalore areas.` } },
      ],
    },
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <main style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
        <nav style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
          <Link href="/">Home</Link> &rsaquo; <Link href="/car">Cars</Link> &rsaquo; <span>{car.name}</span>
        </nav>

        <h1>{car.name} Self Drive Rental in Chennai</h1>
        <p style={{ fontSize: 17, color: "#555", marginBottom: 24 }}>
          Rent {car.name} starting from <strong>₹{car.pricePerHour}/hour</strong> or{" "}
          <strong>₹{car.pricePerDay}/day</strong>. Zero deposit · Unlimited km · Home delivery · Fully insured.
        </p>

        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          {[["Per Hour", `₹${car.pricePerHour}`], ["Per Day", `₹${car.pricePerDay}`], ["Per Month", `₹${car.pricePerMonth.toLocaleString("en-IN")}`]].map(([label, price]) => (
            <div key={label} style={{ border: "1px solid #ddd", borderRadius: 12, padding: "16px 24px", minWidth: 140, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{price}</div>
            </div>
          ))}
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2>About {car.name}</h2>
          <p>{car.description}</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 2 }}>
            <li>Transmission: {car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)}</li>
            <li>Seats: {car.seats}</li>
            <li>Fuel: {car.fuel.charAt(0).toUpperCase() + car.fuel.slice(1)}</li>
            <li>Features: {car.features.join(" · ")}</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Rent {car.name} in Other Cities</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            {cities.map((city) => (
              <li key={city.slug}><Link href={`/rent/${car.slug}/${city.slug}`}>{car.name} Rental in {city.name}</Link></li>
            ))}
          </ul>
        </section>

        {relatedCars.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2>Similar {car.type.charAt(0).toUpperCase() + car.type.slice(1)}s You Can Rent</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
              {relatedCars.map((c) => (
                <li key={c.slug}><Link href={`/rent/${c.slug}`}>{c.name} Rental — ₹{c.pricePerDay}/day</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section style={{ marginBottom: 32 }}>
          <h2>FAQs</h2>
          {[
            { q: `What is the price to rent ${car.name}?`, a: `₹${car.pricePerHour}/hour or ₹${car.pricePerDay}/day. No security deposit required.` },
            { q: `Is there a security deposit?`, a: `No. MM Miles charges zero security deposit.` },
            { q: `Does it include unlimited km?`, a: `Yes. All MM Miles rentals include unlimited km.` },
            { q: `Can I get home delivery?`, a: `Yes. We deliver across Chennai, Coimbatore and Bangalore.` },
          ].map(({ q, a }) => (
            <details key={q} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
              <summary style={{ fontWeight: 600, cursor: "pointer" }}>{q}</summary>
              <p style={{ marginTop: 8, color: "#555" }}>{a}</p>
            </details>
          ))}
        </section>

        <section style={{ background: "#f5f5f5", borderRadius: 12, padding: 24, textAlign: "center" }}>
          <h2>Book {car.name} Self Drive Now</h2>
          <p>Zero deposit · Unlimited km · Home delivery · 24/7 support</p>
          <Link href="/car" style={{ display: "inline-block", marginTop: 12, background: "#000", color: "#fff", padding: "12px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Browse All Cars →</Link>
        </section>
      </main>
    </>
  );
}
