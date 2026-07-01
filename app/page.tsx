import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import HorizontalShowcase from "@/components/HorizontalShowcase";
import Coverage from "@/components/Coverage";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Marquee />
        {/* anchor for the "Services / Capabilities" nav link, which lives in the showcase */}
        <div id="services" />
        <HorizontalShowcase />
        <Coverage />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
