import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import PainSolutionSection from "@/components/home/PainSolutionSection";
import ProductSpotlight from "@/components/home/ProductSpotlight";
import IngredientSection from "@/components/home/IngredientSection";
import SocialProofSection from "@/components/home/SocialProofSection";
import QualitySection from "@/components/home/QualitySection";
import FaqSection from "@/components/home/FaqSection";
import FinalCtaSection from "@/components/home/FinalCtaSection";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustStrip />
      <PainSolutionSection />
      <ProductSpotlight />
      <IngredientSection />
      <SocialProofSection />
      <QualitySection />
      <FaqSection />
      <FinalCtaSection />
    </main>
  );
}
