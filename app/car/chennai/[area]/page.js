import Link from "next/link";

const areas = [
  "anna-nagar",
  "velachery",
  "omr",
  "ecr",
  "t-nagar",
  "porur",
  "tambaram",
  "chrompet",
  "adyar",
  "nungambakkam",
  "mogappair",
  "guindy",
  "ashok-nagar",
  "kk-nagar",
  "madipakkam"
];

export async function generateStaticParams() {
  return areas.map((area) => ({ area }));
}

export default async function AreaPage({ params }) {
  const resolvedParams = await params;
  const areaName = resolvedParams.area.replaceAll("-", " ");

  return (
    <main style={{ padding: 40 }}>

      <h1>Self Drive Car Rentals in {areaName}, Chennai</h1>

      <p>
        Explore self drive car rentals in {areaName}.
        Affordable pricing and instant booking with MM Miles.
      </p>

      <h2>Popular Cars</h2>

      <ul>
        <li><Link href="/rent/toyota-fortuner">Toyota Fortuner</Link></li>
        <li><Link href="/rent/tata-harrier">Tata Harrier</Link></li>
        <li><Link href="/rent/mahindra-thar">Mahindra Thar</Link></li>
      </ul>

    </main>
  );
}
