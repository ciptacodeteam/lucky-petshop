import AppLogo from "@/components/ui/brand-logo";

const LandingPage = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <AppLogo clickable />
        <h1>Welcome to the Landing Page</h1>
        <p>This is the main content of the landing page.</p>
      </div>
    </>
  );
};
export default LandingPage;
