import { Button } from "./ui/button";

const WhyWeStartedSection = () => (
  <section className="w-full flex flex-col items-center py-16 px-2 sm:px-6 lg:px-12 xl:px-24 2xl:px-32 bg-transparent">
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 relative">
      <div className="relative w-full h-[320px] md:h-[420px] lg:h-[480px] xl:h-[520px]">
        <img
          src="/close-up.jpg"
          alt="Why We Started"
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>
      <div className="relative flex items-center justify-center md:justify-start">
        <div className="bg-white dark:bg-card rounded-lg shadow-lg px-6 py-8 md:px-10 md:py-12 max-w-xl w-full md:absolute md:-left-20 md:bottom-0 md:top-auto z-10">
          <h4 className="text-sm font-semibold tracking-widest mb-4 logo-inkspire uppercase">
            Why We Started
          </h4>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 logo-inkspire leading-tight">
            It started out as a simple idea and evolved into our passion
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            What began as a desire to connect writers and readers quickly grew
            into a mission to inspire creativity and foster a vibrant community.
            Our journey is driven by passion, collaboration, and the belief that
            every story matters.
          </p>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded transition text-base">
            Discover our story &gt;
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default WhyWeStartedSection;
