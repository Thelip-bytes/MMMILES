import Link from "next/link";
import { notFound } from "next/navigation";
import { cars, getCarBySlug } from "@/lib/cars";
import { getActiveCities, getCityBySlug } from "@/lib/cities";

export async function generateStaticParams() {
  const params = [];
  const activeCities = getActiveCities();
  cars.forEach((car) => {
    activeCities.forEach((city) => {
      params.push({ slug: car.slug, city: city.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }) {
  const p = await params;
  const car = getCarBySlug(p.slug);
  const city = getCityBySlug(p.city);
  if (!car || !city) return { title: "Not Found" };
  return {
    title: `${car.name} Rental in ${city.name} | Self Drive | No Deposit | MM Miles`,
    description: `Rent ${car.name} in ${city.name} from ₹${car.pricePerDay}/day. Zero deposit, unlimited km, home delivery across ${city.name}. Book in 2 minutes!`,
    keywords: [`${car.name} rental ${city.name}`, `${car.name} self drive ${city.name}`, `rent ${car.name} ${city.name}`].join(", "),
    alternates: { canonical: `https://www.mmmiles.com/rent/${car.slug}/${city.slug}` },
    openGraph: {
      title: `${car.name} Rental in ${city.name} | MM Miles`,
      description: `Rent ${car.name} in ${city.name}. Zero deposit, unlimited km. Book now!`,
      url: `https://www.mmmiles.com/rent/${car.slug}/${city.slug}`,
    },
  };
}

export default async function CarCityPage({ params }) {
  const p = await params;
  const car = getCarBySlug(p.slug);
  const city = getCityBySlug(p.city);
  if (!car || !city) notFound();

  const otherCities = getActiveCities().filter((c) => c.slug !== city.slug);
  const relatedCars = cars.filter((c) => c.type === car.type && c.slug !== car.slug).slice(0, 5);

  const schemas = [
    {
      "@context": "https://schema.org", "@type": "Product",
      name: `${car.name} Self Drive Rental - ${city.name}`,
      description: `Rent ${car.name} in ${city.name} for self drive. ${car.description}`,
      brand: { "@type": "Brand", name: "MM Miles" },
      offers: {
        "@type": "AggregateOffer", lowPrice: car.pricePerHour, highPrice: car.pricePerDay,
        priceCurrency: "INR", availability: "https://schema.org/InStock",
        areaServed: { "@type": "City", name: city.name, addressRegion: city.state, addressCountry: "IN" },
        seller: { "@type": "Organization", name: "MM Miles" },
      },
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: `What is the price to rent ${car.name} in ${city.name}?`, acceptedAnswer: { "@type": "Answer", text: `₹${car.pricePerHour}/hour or ₹${car.pricePerDay}/day. No security deposit required.` } },
        { "@type": "Question", name: `Is there a security deposit for ${car.name} in ${city.name}?`, acceptedAnswer: { "@type": "Answer", text: `No. MM Miles charges zero security deposit in ${city.name}.` } },
        { "@type": "Question", name: `Does MM Miles offer home delivery of ${car.name} in ${city.name}?`, acceptedAnswer: { "@type": "Answer", text: `Yes. We deliver ${car.name} to your doorstep across all areas of ${city.name}.` } },
        { "@type": "Question", name: `Is ${car.name} rental unlimited km in ${city.name}?`, acceptedAnswer: { "@type": "Answer", text: `Yes. All rentals in ${city.name} include unlimited km.` } },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mmmiles.com" },
        { "@type": "ListItem", position: 2, name: `Car Rental ${city.name}`, item: `https://www.mmmiles.com/cities/${city.slug}` },
        { "@type": "ListItem", position: 3, name: `${car.name} ${city.name}`, item: `https://www.mmmiles.com/rent/${car.slug}/${city.slug}` },
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
          <Link href="/">Home</Link> &rsaquo;{" "}
          <Link href={`/cities/${city.slug}`}>Car Rental {city.name}</Link> &rsaquo;{" "}
          <Link href={`/rent/${car.slug}`}>{car.name}</Link> &rsaquo;{" "}
          <span>{city.name}</span>
        </nav>

        <h1>{car.name} Rental in {city.name} | Self Drive</h1>
        <p style={{ fontSize: 17, color: "#555", marginBottom: 24 }}>
          Rent {car.name} in {city.name} starting from <strong>₹{car.pricePerHour}/hour</strong> or{" "}
          <strong>₹{car.pricePerDay}/day</strong>. Zero deposit · Unlimited km · Home delivery across {city.name}.
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
          <h2>Why Rent {car.name} from MM Miles in {city.name}?</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            <li>Zero security deposit — no money blocked</li>
            <li>Unlimited km — drive anywhere in {city.state}</li>
            <li>Home delivery across all {city.name} areas</li>
            <li>Fully insured {car.name} — no hidden charges</li>
            <li>24/7 roadside assistance in {city.name}</li>
          </ul>
        </section>

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
          <h2>Popular Road Trips from {city.name} in {car.name}</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            {city.popularDestinations.map(({ name, distance, time }) => (
              <li key={name}>{city.name} to {name} — {distance} ({time})</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>{car.name} Delivery Areas in {city.name}</h2>
          <ul style={{ paddingLeft: 20, columns: 2, lineHeight: 2.2 }}>
            {city.areas.map((area) => (
              <li key={area.slug}><Link href={`/cities/${city.slug}/${area.slug}`}>{area.name}</Link></li>
            ))}
          </ul>
        </section>

        {otherCities.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2>Rent {car.name} in Other Cities</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
              {otherCities.map((c) => (
                <li key={c.slug}><Link href={`/rent/${car.slug}/${c.slug}`}>{car.name} Rental in {c.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        {relatedCars.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2>Other {car.type.charAt(0).toUpperCase() + car.type.slice(1)}s in {city.name}</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
              {relatedCars.map((c) => (
                <li key={c.slug}><Link href={`/rent/${c.slug}/${city.slug}`}>{c.name} Rental in {city.name} — ₹{c.pricePerDay}/day</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section style={{ marginBottom: 32 }}>
          <h2>FAQs — {car.name} Rental in {city.name}</h2>
          {[
            { q: `What is the price to rent ${car.name} in ${city.name}?`, a: `₹${car.pricePerHour}/hour or ₹${car.pricePerDay}/day. No security deposit required.` },
            { q: `Is there a security deposit?`, a: `No. MM Miles charges zero security deposit.` },
            { q: `Does MM Miles offer home delivery in ${city.name}?`, a: `Yes. We deliver to your doorstep across all areas of ${city.name}.` },
            { q: `Is ${car.name} rental unlimited km?`, a: `Yes. All rentals include unlimited km.` },
          ].map(({ q, a }) => (
            <details key={q} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
              <summary style={{ fontWeight: 600, cursor: "pointer" }}>{q}</summary>
              <p style={{ marginTop: 8, color: "#555" }}>{a}</p>
            </details>
          ))}
        </section>

        <section style={{ background: "#f5f5f5", borderRadius: 12, padding: 24, textAlign: "center" }}>
          <h2>Book {car.name} in {city.name} Now</h2>
          <p>Zero deposit · Unlimited km · Home delivery · 24/7 support</p>
          <Link href="/car" style={{ display: "inline-block", marginTop: 12, background: "#000", color: "#fff", padding: "12px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Book Now →</Link>
        </section>
      </main>
    </>
  );
}
