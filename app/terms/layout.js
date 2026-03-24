"use server"; // layout files always run on server - safe to export metadata here

export const metadata = {
  title: "Terms & Conditions | MM Miles Car Rental Chennai",
  description:
    "Read the terms and conditions for self drive car rental at MM Miles Chennai. Booking policy, cancellation, fuel, insurance and usage rules.",
  robots: {
    index: false,   // T&C pages must NOT appear in Google — they dilute authority
    follow: true,   // still follow links on this page
  },
  alternates: {
    canonical: "https://www.mmmiles.com/terms",
  },
};

export default function TermsLayout({ children }) {
  return <>{children}</>;
}
