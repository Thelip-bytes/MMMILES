"use server";

export const metadata = {
  title: "Car Rental Insurance Coverage | MM Miles Chennai",
  description:
    "All MM Miles self drive cars are fully insured. Learn about our insurance coverage, what is included, deductibles and how you are protected on every trip in Chennai.",
  keywords: [
    "car rental insurance Chennai",
    "self drive car insurance Chennai",
    "MM Miles insurance coverage",
    "fully insured car rental Chennai",
  ].join(", "),
  alternates: {
    canonical: "https://www.mmmiles.com/insurance",
  },
  openGraph: {
    title: "Car Rental Insurance Coverage | MM Miles Chennai",
    description:
      "All MM Miles self drive cars are fully insured. Learn what is covered on every rental.",
    url: "https://www.mmmiles.com/insurance",
  },
  // Insurance page SHOULD be indexed — customers search for this
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function InsuranceLayout({ children }) {
  return <>{children}</>;
}
