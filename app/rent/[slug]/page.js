
import Link from "next/link";

const cars = [
  "toyota-fortuner",
  "innova-crysta",
  "tata-harrier",
  "mahindra-thar",
  "mahindra-xuv700",
  "tata-nexon",
  "toyota-fortuner",
    "innova-crysta",
    "tata-harrier",
    "mahindra-thar",
    "maruti-fronx",
    "hyundai-creta",
    "honda-city",
    "volkswagen-virtus",
    "skoda-slavia",
    "kia-seltos",
    "mahindra-xuv700",
    "toyota-glanza",
    "hyundai-i20",
    "tata-nexon",
    "maruti-brezza",
  "maruti-brezza",
  "maruti-fronx",
  "hyundai-creta",
  "hyundai-i20",
  "honda-city",
  "honda-amaze",
  "volkswagen-virtus",
  "skoda-slavia",
  "kia-seltos",
  "mg-hector",
  "toyota-glanza",
  "tata-safari",
  "mahindra-scorpio",
  "hyundai-venue"
];

export async function generateStaticParams() {
  return cars.map((slug) => ({ slug }));
}

export default function RentPage({ params }) {

  const name = params.slug.replaceAll("-", " ");

  return (
    <main style={{ padding: 40 }}>

      <h1>{name} Self Drive Rental in Chennai</h1>

      <p>
        Book {name} self drive car rental in Chennai with MM Miles.
        Easy online booking, affordable pricing and 24/7 support.
      </p>

      <h2>Browse Popular Rentals</h2>

      <ul>
        <li><Link href="/car">All Self Drive Cars</Link></li>
        <li><Link href="/car/chennai/anna-nagar">Anna Nagar Rentals</Link></li>
        <li><Link href="/car/chennai/velachery">Velachery Rentals</Link></li>
      </ul>

    </main>
  );
}
