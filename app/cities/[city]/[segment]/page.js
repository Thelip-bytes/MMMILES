import Link from "next/link";
import { notFound } from "next/navigation";
import { cars, carTypes, getCarsByType } from "@/lib/cars";
import { getActiveCities, getCityBySlug, getAreaBySlug } from "@/lib/cities";

// ─── generateStaticParams ─────────────────────────────────────────────────────
// Generates BOTH area slugs (omr, velachery...) AND type slugs (suv, automatic...)
// under the same [segment] dynamic folder — zero conflicts
export async function generateStaticParams() {
  const params = [];
  getActiveCities().forEach((city) => {
    // Area segments
    city.areas.forEach((area) => {
      params.push({ city: city.slug, segment: area.slug });
    });
    // Type segments
    carTypes.forEach((type) => {
      params.push({ city: city.slug, segment: type.slug });
    });
  });
  return params;
}

// ─── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const p = await params;
  const city = getCityBySlug(p.city);
  if (!city) return { title: "Not Found" };

  // Check if segment is a car type
  const typeData = carTypes.find((t) => t.slug === p.segment);
  if (typeData) {
    return {
      title: `${typeData.name} Rental in ${city.name} | Self Drive | No Deposit | MM Miles`,
      description: `Rent ${typeData.name.toLowerCase()} cars in ${city.name}. Zero deposit, unlimited km, home delivery. From ₹${city.priceFrom}/day.`,
      keywords: [`${typeData.name.toLowerCase()} rental ${city.name}`, `self drive ${typeData.name.toLowerCase()} ${city.name}`].join(", "),
      alternates: { canonical: `https://www.mmmiles.com/cities/${city.slug}/${p.segment}` },
    };
  }

  // Otherwise it's an area
  const area = getAreaBySlug(p.city, p.segment);
  if (area) {
    return {
      title: `Car Rental in ${area.name}, ${city.name} | Self Drive | No Deposit | MM Miles`,
      description: `Self drive car rental in ${area.name}, ${city.name}. Home delivery to ${area.name}. Zero deposit, unlimited km. Book in 2 minutes!`,
      keywords: [`car rental ${area.name} ${city.name}`, `self drive car ${area.name}`, `car rental near ${area.name}`].join(", "),
      alternates: { canonical: `https://www.mmmiles.com/cities/${city.slug}/${area.slug}` },
      openGraph: {
        title: `Car Rental in ${area.name}, ${city.name} | MM Miles`,
        description: `Self drive car rental in ${area.name}, ${city.name}. Zero deposit, home delivery.`,
        url: `https://www.mmmiles.com/cities/${city.slug}/${area.slug}`,
      },
    };
  }

  return { title: "Not Found" };
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function SegmentPage({ params }) {
  const p = await params;
  const city = getCityBySlug(p.city);
  if (!city) notFound();

  // Detect: is this segment a car type or an area?
  const typeData = carTypes.find((t) => t.slug === p.segment);
  const area = getAreaBySlug(p.city, p.segment);

  if (!typeData && !area) notFound();

  // ── Render TYPE page ───────────────────────────────────────────────────────
  if (typeData) {
    const typeCars = getCarsByType(p.segment);
    const otherTypes = carTypes.filter((t) => t.slug !== p.segment);

    return (
      <main style={{ padding: 40, maxWidth: 960, margin: "0 auto" }}>
        <nav style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
          <Link href="/">Home</Link> &rsaquo;{" "}
          <Link href={`/cities/${city.slug}`}>Car Rental {city.name}</Link> &rsaquo;{" "}
          <span>{typeData.name}</span>
        </nav>

        <h1>{typeData.name} Rental in {city.name} | Self Drive</h1>
        <p style={{ fontSize: 17, color: "#555", marginBottom: 24 }}>
          Rent {typeData.name.toLowerCase()} cars in {city.name} starting from{" "}
          <strong>₹{city.priceFrom}/day</strong>. Zero deposit · Unlimited km · Home delivery.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2>All {typeData.name} Cars Available in {city.name}</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            {typeCars.map((car) => (
              <li key={car.slug}>
                <Link href={`/rent/${car.slug}/${city.slug}`}>{car.name} Rental in {city.name}</Link>
                {" "}— ₹{car.pricePerDay}/day · {car.seats} Seats · {car.transmission}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Other Car Types in {city.name}</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {otherTypes.map(({ slug, name }) => (
              <Link key={slug} href={`/cities/${city.slug}/${slug}`} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "8px 16px", textDecoration: "none", color: "#333", fontSize: 14 }}>
                {name} Rental
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>{typeData.name} Rental by Area in {city.name}</h2>
          <ul style={{ paddingLeft: 20, columns: 2, lineHeight: 2.2 }}>
            {city.areas.map((a) => (
              <li key={a.slug}>
                <Link href={`/cities/${city.slug}/${a.slug}`}>{typeData.name} Rental {a.name}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ background: "#f5f5f5", borderRadius: 12, padding: 24, textAlign: "center" }}>
          <h2>Book {typeData.name} Rental in {city.name}</h2>
          <p>Zero deposit · Unlimited km · Home delivery</p>
          <Link href="/car" style={{ display: "inline-block", marginTop: 12, background: "#000", color: "#fff", padding: "12px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Browse All Cars →</Link>
        </section>
      </main>
    );
  }

  // ── Render AREA page ───────────────────────────────────────────────────────
  const popularCars = cars.filter((c) => c.popular);
  const nearbyAreas = city.areas.filter((a) => a.slug !== area.slug).slice(0, 10);

  const schemas = [
    {
      "@context": "https://schema.org", "@type": "LocalBusiness",
      name: "MM Miles",
      description: `Self drive car rental in ${area.name}, ${city.name}.`,
      url: `https://www.mmmiles.com/cities/${city.slug}/${area.slug}`,
      telephone: city.phone,
      address: { "@type": "PostalAddress", streetAddress: area.name, addressLocality: city.name, addressRegion: city.state, addressCountry: "IN" },
      geo: { "@type": "GeoCoordinates", latitude: city.coordinates.lat, longitude: city.coordinates.lng },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.5", reviewCount: "10000" },
      openingHours: "Mo-Su 00:00-23:59", priceRange: "₹₹",
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: `Does MM Miles offer car rental in ${area.name}, ${city.name}?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Zero deposit, unlimited km, home delivery in ${area.name}, ${city.name}.` } },
        { "@type": "Question", name: `What is the price for car rental in ${area.name}?`, acceptedAnswer: { "@type": "Answer", text: `Starts from ₹${city.priceFrom}/day. No security deposit required.` } },
        { "@type": "Question", name: `Can I get a car delivered to my home in ${area.name}?`, acceptedAnswer: { "@type": "Answer", text: `Yes. We deliver to your door in ${area.name} within 2 hours of booking.` } },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mmmiles.com" },
        { "@type": "ListItem", position: 2, name: `Car Rental ${city.name}`, item: `https://www.mmmiles.com/cities/${city.slug}` },
        { "@type": "ListItem", position: 3, name: `Car Rental ${area.name}`, item: `https://www.mmmiles.com/cities/${city.slug}/${area.slug}` },
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
          <Link href="/">Home</Link> &rsaquo;{" "}
          <Link href={`/cities/${city.slug}`}>Car Rental {city.name}</Link> &rsaquo;{" "}
          <span>{area.name}</span>
        </nav>

        <h1>Self Drive Car Rental in {area.name}, {city.name}</h1>
        <p style={{ fontSize: 17, color: "#555", marginBottom: 8 }}>
          Rent self drive cars in {area.name}, {city.name} starting from{" "}
          <strong>₹{city.priceFrom}/day</strong>. Home delivery to {area.name} · Zero deposit · Unlimited km.
        </p>
        {area.landmarks?.length > 0 && (
          <p style={{ fontSize: 14, color: "#777", marginBottom: 24 }}>
            Serving {area.landmarks.join(", ")} and surrounding areas.
          </p>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          {[`Delivery to ${area.name}`, "Zero Deposit", "Unlimited KM", "Fully Insured", "24/7 Support"].map((u) => (
            <span key={u} style={{ background: "#f0f0f0", borderRadius: 99, padding: "5px 14px", fontSize: 13, fontWeight: 500 }}>{u}</span>
          ))}
        </div>

        <section style={{ marginBottom: 32 }}>
          <h2>Car Types Available in {area.name}</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[["suv","SUV Rental"],["automatic","Automatic Cars"],["cheap","Budget Cars"],["electric","Electric Cars"]].map(([slug, label]) => (
              <Link key={slug} href={`/cities/${city.slug}/${slug}`} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "7px 16px", textDecoration: "none", color: "#333", fontSize: 14 }}>{label}</Link>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Popular Self Drive Cars in {area.name}, {city.name}</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            {popularCars.map((car) => (
              <li key={car.slug}>
                <Link href={`/rent/${car.slug}/${city.slug}`}>{car.name} Self Drive in {city.name}</Link>
                {" "}— ₹{car.pricePerDay}/day
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Why Choose MM Miles in {area.name}?</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            <li>Doorstep delivery to {area.name} — no hub visit needed</li>
            <li>Zero security deposit — no money blocked</li>
            <li>Unlimited km — drive to {city.popularDestinations[0]?.name} and back</li>
            <li>Fully insured fleet — drive worry-free</li>
            <li>24/7 roadside assistance across {city.name}</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Popular Road Trips from {area.name}, {city.name}</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            {city.popularDestinations.map(({ name, distance, time }) => (
              <li key={name}>{area.name} to {name} — {distance} ({time})</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>Car Rental in Nearby Areas of {city.name}</h2>
          <ul style={{ paddingLeft: 20, columns: 2, lineHeight: 2.2 }}>
            {nearbyAreas.map((a) => (
              <li key={a.slug}>
                <Link href={`/cities/${city.slug}/${a.slug}`}>Car Rental {a.name}, {city.name}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>FAQs — Car Rental in {area.name}</h2>
          {[
            { q: `Does MM Miles offer car rental in ${area.name}?`, a: `Yes. Home delivery in ${area.name}, ${city.name}. Zero deposit, unlimited km.` },
            { q: `What is the price for car rental in ${area.name}?`, a: `Starts from ₹${city.priceFrom}/day. No security deposit.` },
            { q: `Can I get a car delivered to my home in ${area.name}?`, a: `Yes. We deliver to your door in ${area.name} within 2 hours.` },
            { q: `Are cars available with unlimited km in ${area.name}?`, a: `Yes. All MM Miles self drive cars include unlimited km.` },
          ].map(({ q, a }) => (
            <details key={q} style={{ marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
              <summary style={{ fontWeight: 600, cursor: "pointer" }}>{q}</summary>
              <p style={{ marginTop: 8, color: "#555" }}>{a}</p>
            </details>
          ))}
        </section>

        <section style={{ background: "#f5f5f5", borderRadius: 12, padding: 24, textAlign: "center" }}>
          <h2>Book Car Rental in {area.name} Now</h2>
          <p>Delivered to your door · Zero deposit · Unlimited km</p>
          <Link href="/car" style={{ display: "inline-block", marginTop: 12, background: "#000", color: "#fff", padding: "12px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Browse All Cars →</Link>
        </section>
      </main>
    </>
  );
}
