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
  title: "MM Miles | Car Rentals in Chennai",
  description: "Rent cars in Chennai with MMmiles. Easy booking, less pricing, and 24/7 support.",
};




export default function HomePage() {
  return (
    <>
      
      <main>
        
        
        <Hero />
        <HomeContent />
        <AdvantageSection />
        < OffersSection />
        <DriveDiscoverSection/>
        <BookingSteps />
        <GuidePage />
        <ReviewSlider />
        <ReviewSection />
        <BecomeHost />
        
        <FAQSection />
        

      </main>
    </>
  );
}
