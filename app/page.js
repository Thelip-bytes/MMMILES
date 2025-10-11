import Navbar from "./components/Navbar";
import ReviewSection from "./components/ReviewSection";
import Footer from "./components/Footer";
import DriveDiscoverSection from "./components/DriveDiscoverSection";
import FAQSection from "./components/FAQSection";
import AdvantageSection from "./components/AdvantageSection";
import SearchBar from "./components/SearchBar";
import Hero from "./components/Hero";
import ReviewSlider from "./components/ReviewSlider";
import BookingSteps from "./components/BookingSteps";
import BecomeHost from "./components/BecomeHost";
import OffersSection from "./components/OfferSection";
import TrendingSection from "./components/TrendingSection";



export const metadata = {
  title: "MM Miles | Affordable Car Rentals in Chennai",
  description: "Book top-rated cars for rent in Chennai with Urban Drive. Easy booking, affordable prices, and premium service.",
};


export default function HomePage() {
  return (
    <>
      
      <main>
        
        
        <Hero />
        <SearchBar />
        <TrendingSection />
        <AdvantageSection />
        < OffersSection />
        <DriveDiscoverSection/>
        <BookingSteps />
        <ReviewSlider />
        <ReviewSection />
        <BecomeHost />
        <FAQSection />
        

      </main>
    </>
  );
}
