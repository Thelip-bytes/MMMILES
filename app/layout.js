import "./../styles/reset.css";
import "./globals.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { Frank_Ruhl_Libre } from "next/font/google";

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-frank-ruhl",
});

const darkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-darker-grotesque",
});

const sanchez = Sanchez({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sanchez",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});


import { 
  Frank_Ruhl_Libre,
  Darker_Grotesque,
  Sanchez,
  Poppins,
} from "next/font/google";


export const metadata = {
  title: "MM Miles | Car Rentals in Chennai",
  description:
    "Rent cars in Chennai with MM Miles. Easy booking, affordable pricing, and 24/7 support.",

  openGraph: {
    title: "MM Miles | Car Rentals in Chennai",
    description:
      "Flexible car rentals for professionals in Chennai. Drive premium cars without ownership.",
    url: "https://www.mmmiles.com/",
    siteName: "MM Miles",
    images: [
      {
        url: "https://www.mmmiles.com/logo2.jpg",
        width: 1200,
        height: 630,
        alt: "MM Miles – Premium car rentals in Chennai",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "MM Miles | Car Rentals in Chennai",
    description:
      "Flexible car rentals for professionals in Chennai.",
    images: ["https://www.mmmiles.com/logo2.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={frankRuhl.variable}>
        <Navbar />

        {children}

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#F9F4EC",
              color: "#333",
              borderRadius: "10px",
              border: "1px solid #d4a762",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily: "Frank Ruhl Libre",
            },
          }}
        />

       

        <Footer />
      </body>
    </html>
  );
}
