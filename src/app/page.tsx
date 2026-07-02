import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import PropertyGrid from "@/components/PropertyGrid";
import SingleSentence from "@/components/SingleSentence";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-obsidian">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <SearchBar />
        <PropertyGrid />
        <SingleSentence />
        <HowItWorks />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
