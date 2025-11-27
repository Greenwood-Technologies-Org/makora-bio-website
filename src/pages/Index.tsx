import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EmailImpact from "@/components/EmailImpact";
import ClinboxHelps from "@/components/ClinboxHelps";
import DemoForm from "@/components/DemoForm";
import Security from "@/components/Security";
import Integrations from "@/components/Integrations";
import TeamLogos from "@/components/TeamLogos";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <EmailImpact />
        <ClinboxHelps />
        <DemoForm />
        <Security />
        <Integrations />
        <ContactSection />
        <TeamLogos />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
