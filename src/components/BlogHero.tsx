import { fadeIn, staggerContainer } from "@/lib/animation";
import { motion } from "framer-motion";

const BlogHero = () => (
  <motion.section
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    className="relative w-full h-[750px] sm:h-[620px] md:h-[1100px] flex items-center bg-black/60 py-8 sm:py-12 md:py-20"
  >
    <motion.img
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.2 }}
      src="/blog-hero.jpg"
      alt="Blog workspace"
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
    <div className="absolute inset-0 bg-black/60 z-10" />
    <motion.div
      variants={staggerContainer}
      className="relative z-20 w-full px-4 sm:px-6 lg:px-12 xl:px-24 2xl:px-32"
    >
      <motion.div variants={fadeIn} className="max-w-3xl w-full py-6 sm:py-10">
        <motion.div
          variants={fadeIn}
          className="mb-2 pt-6 sm:pt-10 text-xs sm:text-sm font-semibold tracking-wide text-white/80"
        >
          FEATURED BLOG
        </motion.div>
        <motion.h1
          variants={fadeIn}
          className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4"
          style={{ color: "#fff" }}
        >
          Discover the Latest Insights & Stories in Design, Tech, and Creativity
        </motion.h1>
        <motion.div
          variants={fadeIn}
          className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 text-white/80 text-xs sm:text-sm"
        >
          <span>
            By{" "}
            <span className="text-yellow-400 font-medium">Inkspire Team</span>
          </span>
          <span>•</span>
          <span>September 4, 2025</span>
        </motion.div>
        <motion.p
          variants={fadeIn}
          className="mb-6 sm:mb-8 text-white/80 text-xs sm:text-base max-w-xs sm:max-w-xl"
        >
          Stay inspired with expert tips, deep dives, and creative journeys from
          our blog. Explore new ideas, trends, and resources to fuel your
          passion.
        </motion.p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="#"
          className="inline-block bg-yellow-400 text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded shadow hover:bg-yellow-500 transition text-sm sm:text-base"
        >
          Read More &gt;
        </motion.a>
      </motion.div>
    </motion.div>
  </motion.section>
);

export default BlogHero;
