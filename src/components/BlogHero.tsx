const BlogHero = () => (
  <section className="relative w-full h-[400px] sm:h-[520px] md:h-[850px] flex items-center bg-black/60 py-8 sm:py-12 md:py-20">
    <img
      src="/blog-hero.jpg"
      alt="Blog workspace"
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
    <div className="absolute inset-0 bg-black/60 z-10" />
    <div className="relative z-20 w-full px-4 sm:px-6 lg:px-12 xl:px-24 2xl:px-32">
      <div className="max-w-3xl w-full py-6 sm:py-10">
        <div className="mb-2 pt-6 sm:pt-10 text-xs sm:text-sm font-semibold tracking-wide text-white/80">
          FEATURED BLOG
        </div>
        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4"
          style={{ color: "#fff" }}
        >
          Discover the Latest Insights & Stories in Design, Tech, and Creativity
        </h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 text-white/80 text-xs sm:text-sm">
          <span>
            By{" "}
            <span className="text-yellow-400 font-medium">Inkspire Team</span>
          </span>
          <span>•</span>
          <span>September 4, 2025</span>
        </div>
        <p className="mb-6 sm:mb-8 text-white/80 text-xs sm:text-base max-w-xs sm:max-w-xl">
          Stay inspired with expert tips, deep dives, and creative journeys from
          our blog. Explore new ideas, trends, and resources to fuel your
          passion.
        </p>
        <a
          href="#"
          className="inline-block bg-yellow-400 text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded shadow hover:bg-yellow-500 transition text-sm sm:text-base"
        >
          Read More &gt;
        </a>
      </div>
    </div>
  </section>
);

export default BlogHero;
