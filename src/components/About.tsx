import { fadeIn, staggerContainer } from "@/lib/animation";
import { motion } from "framer-motion";

const About = () => (
  <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeIn}
    className="relative w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-12 xl:px-24 2xl:px-32 mt-12"
    style={{ backgroundColor: "var(--lavender)" }}
    data-dark
  >
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: "50%" }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="absolute -top-4 right-0 h-4 flex"
    >
      <div className="h-full" style={{ width: "60%", background: "#FFD84D" }} />
      <div className="h-full" style={{ width: "40%", background: "#6C3DCE" }} />
    </motion.div>
    <motion.div
      variants={staggerContainer}
      className="relative z-10 flex flex-col md:flex-row gap-10 md:gap-16 justify-between items-stretch"
    >
      <motion.div
        variants={fadeIn}
        className="w-full md:w-1/2 flex flex-col justify-center mb-10 md:mb-0"
      >
        <h4
          className="text-xs sm:text-sm font-semibold tracking-widest mb-4"
          style={{ color: "var(--foreground)" }}
        >
          ABOUT US
        </h4>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          We are a community of content writers who share their learnings
        </h2>
        <motion.p
          whileHover={{ x: 5 }}
          className="font-semibold mt-4 mb-2 cursor-pointer hover:underline w-fit"
          style={{ color: "#6C3DCE" }}
        >
          Read More &gt;
        </motion.p>
        <p
          className="text-sm sm:text-base opacity-70 max-w-md"
          style={{ color: "var(--foreground)" }}
        >
          Our community brings together passionate writers who are eager to
          share their experiences, insights, and knowledge. We believe in
          learning from each other and growing together through the power of
          shared stories and expertise.
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn}
        className="w-full md:w-1/2 flex flex-col justify-center"
      >
        <h4
          className="text-xs sm:text-sm font-semibold tracking-widest mb-4"
          style={{ color: "var(--foreground)" }}
        >
          OUR MISION
        </h4>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          Creating valuable content for creatives all around the world
        </h2>
        <p
          className="text-sm sm:text-base opacity-70 max-w-md"
          style={{ color: "var(--foreground)" }}
        >
          Our mission is to empower creatives everywhere by providing
          high-quality, insightful content. We strive to inspire, educate, and
          support writers and creators globally, helping them to achieve their
          goals and make a positive impact.
        </p>
      </motion.div>
    </motion.div>
  </motion.section>
);

export default About;
