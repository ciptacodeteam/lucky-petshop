import BannerSection from "@/components/sections/BannerSection";
import MarqueeSection from "@/components/sections/MarqueeSection";

const LandingPage = () => {
  return (
    <main>
      <div className="container mx-auto px-4">
        <BannerSection className="mt-24 lg:mt-40" />
      </div>
      <MarqueeSection />
    </main>
  );
};
export default LandingPage;
