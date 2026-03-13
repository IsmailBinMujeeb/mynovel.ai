import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import { Footer } from "@/components/footer";
import BooksSection from "@/components/books-section";
import { TestimonialsSection } from "@/components/testimonials-section";

export default function IndexPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <BooksSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
