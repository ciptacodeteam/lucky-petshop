import BannerSection from "@/components/sections/BannerSection";
import BenefitHighlightSection from "@/components/sections/BenefitHighlightSection";
import MarqueeSection from "@/components/sections/MarqueeSection";

const LandingPage = () => {
  return (
    <main>
      <div className="container mx-auto px-4">
        <BannerSection className="mt-24 lg:mt-40" />
      </div>
      <MarqueeSection />
      <BenefitHighlightSection />
    </main>
  );
};
export default LandingPage;
