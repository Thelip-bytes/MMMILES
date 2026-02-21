import Link from "next/link";
import Navbar from "./components/Navbar";
import ReviewSection from "./components/ReviewSection";
import Footer from "./components/Footer";
import DriveDiscoverSection from "./components/DriveDiscoverSection";
import FAQSection from "./components/FAQSection";
import AdvantageSection from "./components/AdvantageSection";
import Hero from "./components/Hero";
import ReviewSlider from "./components/ReviewSlider";
import BookingSteps from "./components/BookingSteps";
import BecomeHost from "./components/BecomeHost";
import OffersSection from "./components/OfferSection";
import HomeContent from "./components/HomeContent";
import GuidePage from "./components/guide";



export const metadata = {
  title: "Self Drive Car Rentals in Chennai | MM Miles",
  description:
    "Book self drive car rentals in Chennai with MM Miles. Affordable hatchbacks, sedans and SUVs with flexible booking, transparent pricing and 24/7 support.",
  alternates: {
    canonical: "https://www.mmmiles.com/",
  },
};




export default function HomePage() {
  return (
    <>
      
      <main>
        
        <h1 className="seo-hidden">
          Self Drive Car Rentals in Chennai | Rent Cars Chennai | MM Miles
          </h1>
        <Hero />
        <section className="seo-hidden">
            
          <h2 className="seo-hidden">Self Drive Car Rental in Chennai</h2>

          <p className="seo-hidden">
          MM Miles offers premium self drive car rentals in Chennai including SUVs,
          hatchbacks and sedans for hourly, daily and monthly rental. Whether you need
          a car for office commute, weekend trips or long travel, MM Miles provides
          affordable and flexible rental options.
          </p>

          <h3 className="seo-hidden">Explore Popular Rental Options</h3>

          <ul className="seo-hidden">
          <li><Link href="/car">Browse Available Cars</Link></li>
          <li><Link href="/car/chennai/suv">SUV Rental Chennai</Link></li>
          <li><Link href="/car/chennai/cheap">Budget Car Rental Chennai</Link></li>
          <li><Link href="/car/chennai/automatic">Automatic Car Rental Chennai</Link></li>
          </ul>

          </section>
        <HomeContent />
        <AdvantageSection />
        < OffersSection /> 
        <DriveDiscoverSection/>
        <BookingSteps />
        <GuidePage />
        <ReviewSlider />
        <ReviewSection />
        <BecomeHost />
        

        <section className="seo-hidden">

          <h2>Lowest Self Drive Cars in Chennai</h2>

          <ul>
          <li><Link href="/rent/toyota-fortuner">Toyota Fortuner Rental Chennai</Link></li>
          <li><Link href="/rent/maruti-fronx">Maruti Fronx Self Drive</Link></li>
          <li><Link href="/rent/innova-crysta">Innova Crysta Rental Chennai</Link></li>
          <li><Link href="/rent/tata-harrier">Tata Harrier Rental Chennai</Link></li>
          <li><Link href="/rent/hyundai-venue">Hyundai Venue Rental Chennai</Link></li>
          </ul>

          </section>
        <FAQSection />
        

      </main>
    </>
  );
}
