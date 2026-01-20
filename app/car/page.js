export const metadata = {
  title: "Self Drive Car Rentals in Chennai | MM Miles",
  description:
    "Book self drive cars in Chennai with MM Miles. Hatchbacks, sedans and SUVs with easy online booking, transparent pricing and 24/7 support.",
};

export const dynamic = "force-static";

export default function CarsPage() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>Self Drive Car Rentals in Chennai</h1>

      <p>
        MM Miles provides affordable and premium self drive car rentals in
        Chennai. Book cars online with flexible hourly plans, zero hidden
        charges and round-the-clock customer support.
      </p>

      <h2>Available Cars for Rent</h2>

      <p>
        Choose from hatchbacks for city rides, sedans for comfort travel, and
        SUVs for family trips. All vehicles are regularly serviced and
        sanitized for safety.
      </p>

      <h2>Why Book with MM Miles?</h2>
      <ul>
        <li>✔ Easy online booking</li>
        <li>✔ Transparent pricing</li>
        <li>✔ 24/7 roadside assistance</li>
        <li>✔ Trusted self drive rental service in Chennai</li>
      </ul>

      {/* 🚗 KEEP YOUR EXISTING CAR GRID BELOW */}
    </main>
  );
}
