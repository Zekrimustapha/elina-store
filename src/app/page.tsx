import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGallery from '@/components/ProductGallery';
import Benefits from '@/components/Benefits';
import OfferSection from '@/components/OfferSection';
import OrderForm from '@/components/OrderForm';
import TrustSection from '@/components/TrustSection';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';

export default function Home() {
  return (
    <main className="min-h-screen rtl font-sans" dir="rtl">
      <Header />
      <Hero />
      <ProductGallery />
      <Benefits />
      <OfferSection />
      <OrderForm />
      <TrustSection />
      <Footer />
      <StickyCTA />
    </main>
  );
}
