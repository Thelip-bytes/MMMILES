"use server";

export const metadata = {
  title: "Refund & Cancellation Policy | MM Miles Chennai",
  description:
    "Read MM Miles refund and cancellation policy for self drive car rental bookings in Chennai. Free cancellation up to 48 hours before pickup.",
  robots: {
    index: false,   // Refund pages must NOT appear in Google
    follow: true,
  },
  alternates: {
    canonical: "https://www.mmmiles.com/refund",
  },
};

export default function RefundLayout({ children }) {
  return <>{children}</>;
}
