import Link from "next/link";
import { notFound } from "next/navigation";
import { cars } from "@/lib/cars";
import { getActiveCities, getCityBySlug } from "@/lib/cities";

export async function generateStaticParams() {
  return getActiveCities().map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }) {
  const p = await params;
  const city = getCityBySlug(p.city);
  if (!city) return { title: "Not Found" };
  return {
    title: `Self Drive Car Rental in ${city.name} | No Deposit, Unlimited KM | MM Miles`,
    description: `Rent self drive cars in ${city.name} from ₹${city.priceFrom}/day. Zero deposit, unlimited km, home delivery across all ${city.name} areas. 10,000+ happy customers.`,
    keywords: [`self drive car rental ${city.name}`, `car rental in ${city.name}`, `rent a car ${city.name}`, `no deposit car rental ${city.name}`].join(", "),
    alternates: { canonical: `https://www.mmmiles.com/cities/${city.slug}` },
    openGraph: {
      title: `Self Drive Car Rental in ${city.name} | MM Miles`,
      description: `Rent self drive cars in ${city.name}. Zero deposit, unlimited km. Book now!`,
      url: `https://www.mmmiles.com/cities/${city.slug}`,
    },
  };
}

export default async function CityPage({ params }) {
  const p = await params;
  const city = getCityBySlug(p.city);
  if (!city) notFound();

  const popularCars = cars.filter((c) => c.popular);
  const otherCities = getActiveCities().filter((c) => c.slug !== city.slug);

  const schemas = [
    {
      "@context": "https://schema.org", "@type": "LocalBusiness",
      name: "MM Miles",
      description: `Self drive car rental in ${city.name} with zero deposit and unlimited km.`,
      url: `https://www.mmmiles.com/cities/${city.slug}`,
      telephone: city.phone,
      address: { "@type": "PostalAddress", addressLocality: city.name, addressRegion: city.state, addressCountry: "IN" },
      geo: { "@type": "GeoCoordinates", latitude: city.coordinates.lat, longitude: city.coordinates.lng },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.5", reviewCount: "10000" },
      openingHours: "Mo-Su 00:00-23:59", priceRange: "₹₹",
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: `What is the price for self drive car rental in ${city.name}?`, acceptedAnswer: { "@type": "Answer", text: `Self drive car rental in ${city.name} starts from ₹${city.priceFrom}/day. No security deposit required.` } },
        { "@type": "Question", name: `Is there a security deposit for car rental in ${city.name}?`, acceptedAnswer: { "@type": "Answer", text: `No. MM Miles charges zero security deposit. You only pay the rental fee.` } },
        { "@type": "Question", name: `Does MM Miles offer home delivery in ${city.name}?`, acceptedAnswer: { "@type": "Answer", text: `Yes. MM Miles delivers to all areas of ${city.name} including ${city.areas.slice(0, 4).map((a) => a.name).join(", ")} and more.` } },
        { "@type": "Question", name: `Are cars available with unlimited km in ${city.name}?`, acceptedAnswer: { "@type": "Answer", text: `Yes. All MM Miles self drive cars in ${city.name} include unlimited km.` } },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mmmiles.com" },
        { "@type": "ListItem", position: 2, name: `Car Rental ${city.name}`, item: `https://www.mmmiles.com/cities/${city.slug}` },
      ],
    },
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <main style={{ padding: 40, maxWidth: 960, margin: "0 auto" }}>
        <nav style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
          <Link href="/">Home</Link> &rsaquo; <span>Car Rental {city.name}</span>
        </nav>

        <h1>Self Drive Car Rental in {city.name}</h1>
        <p style={{ fontSize: 17, color: "#555", marginBottom: 8 }}>
          Rent self drive cars in {city.name} starting from <strong>₹{city.priceFrom}/day</strong>.
          Zero deposit · Unlimited km · Home delivery across all {city.name} areas.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          {["Zero Security Deposit", "Unlimited KM", "Home Delivery", "Fully Insured", "24/7 Support", "4.5★ Rated"].map((u) => (
            <span key={u} style={{ background: "#f0f0f0", borderRadius: 99, padding: "5px 14px", fontSize: 13, fontWeight: 500 }}>{u}</span>
          ))}
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2>Browse Cars by Type in {city.name}</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[["suv","SUV Rental"],["automatic","Automatic Cars"],["cheap","Budget Cars"],["sedan","Sedan Rental"],["hatchback","Hatchbacks"],["electric","Electric Cars"],["7-seater","7 Seater Cars"]].map(([slug, label]) => (
              <Link key={slug} href={`/cities/${city.slug}/${slug}`} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "8px 18px", textDecoration: "none", color: "#333", fontSize: 14 }}>{label}</Link>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Most Popular Self Drive Cars in {city.name}</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            {popularCars.map((car) => (
              <li key={car.slug}>
                <Link href={`/rent/${car.slug}/${city.slug}`}>{car.name} Rental in {city.name}</Link>
                {" "}— ₹{car.pricePerDay}/day
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Browse All Self Drive Cars in {city.name}</h2>
          <ul style={{ paddingLeft: 20, columns: 2, lineHeight: 2.2 }}>
            {cars.map((car) => (
              <li key={car.slug}>
                <Link href={`/rent/${car.slug}/${city.slug}`}>{car.name} — ₹{car.pricePerDay}/day</Link>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Self Drive Car Rental by Area in {city.name}</h2>
          <ul style={{ paddingLeft: 20, columns: 2, lineHeight: 2.2 }}>
            {city.areas.map((area) => (
              <li key={area.slug}>
                <Link href={`/cities/${city.slug}/${area.slug}`}>Car Rental {area.name}, {city.name}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Popular Road Trips from {city.name}</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            {city.popularDestinations.map(({ name, distance, time }) => (
              <li key={name}>{city.name} to {name} — {distance} ({time})</li>
            ))}
          </ul>
        </section>

        {otherCities.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2>MM Miles in Other Cities</h2>
            <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
              {otherCities.map((c) => (
                <li key={c.slug}><Link href={`/cities/${c.slug}`}>Self Drive Car Rental in {c.name}</Link></li>
              ))}
            </ul>
          </section>
        )}

        <section style={{ marginBottom: 32 }}>
          <h2>FAQs — Car Rental in {city.name}</h2>
          {[
            { q: `What is the price for self drive car rental in ${city.name}?`, a: `Starts from ₹${city.priceFrom}/day. No security deposit required.` },
            { q: `Is there a security deposit for car rental in ${city.name}?`, a: `No. MM Miles charges zero security deposit.` },
            { q: `Does MM Miles offer home delivery in ${city.name}?`, a: `Yes. We deliver across all ${city.name} areas.` },
            { q: `Are cars available with unlimited km in ${city.name}?`, a: `Yes. All MM Miles self drive cars include unlimited km.` },
            { q: `What documents do I need to rent a car in ${city.name}?`, a: `Valid driving license + Aadhaar card or government-issued ID.` },
          ].map(({ q, a }) => (
            <details key={q} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
              <summary style={{ fontWeight: 600, cursor: "pointer" }}>{q}</summary>
              <p style={{ marginTop: 8, color: "#555" }}>{a}</p>
            </details>
          ))}
        </section>

        <section style={{ background: "#f5f5f5", borderRadius: 12, padding: 24, textAlign: "center" }}>
          <h2>Book Self Drive Car Rental in {city.name} Now</h2>
          <p>Zero deposit · Unlimited km · Home delivery · 24/7 support</p>
          <Link href="/car" style={{ display: "inline-block", marginTop: 12, background: "#000", color: "#fff", padding: "12px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Browse All Cars →</Link>
        </section>
      </main>
    </>
  );
}
