import AllPosts from "@/components/AllPosts";
import BlogHero from "../components/BlogHero";
import AboutMissionSection from "../components/About";
import WhyWeStartedSection from "../components/WhyWeStartedSection";
import AuthorsSection from "../components/Authors";

const Home = () => (
  <>
    <BlogHero />
    <div className="mt-8">
      <AllPosts />
    </div>
    <AboutMissionSection />
    <WhyWeStartedSection />
    <AuthorsSection />
  </>
);

export default Home;
