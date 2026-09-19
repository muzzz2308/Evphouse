import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.35 },
};

const About = () => {
  return (
    <div className="bg-gray-50">
      <section className="bg-[#0F172A] text-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6"
          >
            About Elite Valve
          </motion.h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-sm sm:text-base">
            Delivering reliable industrial valve solutions designed for
            performance, durability, and safety in demanding industries.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.img
            {...fadeUp}
            src="/images/about-img.webp"
            alt="Valve"
            width={1400}
            height={933}
            loading="lazy"
            decoding="async"
            className="rounded-xl shadow-lg w-full object-cover max-h-80 md:max-h-none"
          />

          <motion.div {...fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4">
              Engineering Excellence
            </h2>

            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Elite Valve specializes in manufacturing high-performance
              industrial valves used in critical infrastructure and industrial
              systems.
            </p>

            <p className="text-gray-600 text-sm sm:text-base">
              Our engineering team focuses on precision design, quality
              materials, and rigorous testing to ensure every valve meets the
              highest standards of reliability.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "120+", label: "Projects Delivered" },
              { value: "35+", label: "Industrial Clients" },
              { value: "20+", label: "Valve Products" },
            ].map((stat) => (
              <motion.div key={stat.label} {...fadeUp}>
                <h3 className="text-3xl sm:text-4xl font-bold text-[#F59E0B]">
                  {stat.value}
                </h3>
                <p className="text-gray-600 mt-2 text-xs sm:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            {...fadeUp}
            className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-8 sm:mb-12"
          >
            Industries We Serve
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {[
              "Oil & Gas",
              "Chemical Processing",
              "Water Treatment",
              "Power Generation",
            ].map((industry) => (
              <motion.div
                key={industry}
                {...fadeUp}
                className="bg-white p-4 sm:p-6 rounded-xl shadow text-sm sm:text-base font-medium text-[#0F172A] hover:shadow-lg hover:border-[#F59E0B]/20 border border-transparent transition"
              >
                {industry}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.h2
            {...fadeUp}
            className="text-2xl sm:text-3xl font-bold text-center text-[#0F172A] mb-8 sm:mb-12"
          >
            Our Journey
          </motion.h2>

          <div className="space-y-8 sm:space-y-10">
            {[
              {
                year: "2010",
                text: "Elite Valve was founded with the mission to deliver reliable industrial valve solutions.",
              },
              {
                year: "2015",
                text: "Expanded product portfolio including floating ball valves and gate valves.",
              },
              {
                year: "2020",
                text: "Delivered projects for multiple oil & gas and water treatment facilities.",
              },
              {
                year: "Today",
                text: "Continuing to innovate and deliver high-quality industrial valve solutions worldwide.",
              },
            ].map((item) => (
              <motion.div key={item.year} {...fadeUp} className="flex gap-4 sm:gap-6">
                <div className="text-[#F59E0B] font-bold w-14 sm:w-16 shrink-0">
                  {item.year}
                </div>
                <p className="text-gray-600 text-sm sm:text-base">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
