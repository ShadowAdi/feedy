import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import HomeSection from "@/components/HomeSection";

export default function Home() {
  return (
    <main className="h-full flex flex-col gap-9 items-center  w-screen justify-center">
      <HomeSection />
      <FeaturesSection />
      <Footer/>
    </main>
  );
}
