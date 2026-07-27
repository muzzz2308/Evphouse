import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, FileText } from "lucide-react";
import valve1 from "../assets/slider/valve1.png";
import valve2 from "../assets/slider/valve2.png";
import valve3 from "../assets/slider/valve3.png";
import valve4 from "../assets/slider/valve4.png";
import { useProductRanges } from "../hooks/useProductRanges";
import { useCertifications } from "../hooks/useCertifications";
import { HomeSkeleton, RangeCardsSkeleton, CertsCarouselSkeleton } from "../components/Skeleton";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45 },
};

function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setCount(4);
      else if (w >= 1024) setCount(3);
      else if (w >= 640) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export default function Home() {
  const { ranges, loading: rangesLoading } = useProductRanges();
  const { certifications, loading: certsLoading } = useCertifications();
  const [start, setStart] = useState(0);
  const [activeCert, setActiveCert] = useState(null);
  const visibleCount = useVisibleCount();

  const maxStart = Math.max(0, certifications.length - visibleCount);

  useEffect(() => {
    setStart((prev) => Math.min(prev, maxStart));
  }, [maxStart]);

  useEffect(() => {
    if (!activeCert) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeCert]);

  const next = () => setStart((prev) => Math.min(prev + 1, maxStart));
  const prev = () => setStart((prev) => Math.max(prev - 1, 0));

  const sliderImages = useMemo(() => [valve1, valve2, valve3, valve4], []);

  const pageLoading = rangesLoading && certsLoading;

  if (pageLoading) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <section className="bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.14),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(30,41,59,0.9),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-12 sm:pb-14 md:py-16 grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center relative w-full md:min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-1 text-center md:text-left"
          >
            <p className="text-[#F59E0B] font-semibold tracking-wide text-xs sm:text-sm mb-3 uppercase">
              Elite Valves
            </p>
            <h1 className="text-[1.75rem] leading-tight sm:text-4xl md:text-5xl uppercase font-bold">
              Precision Engineered{" "}
              <span className="block sm:inline">Industrial Valves</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-gray-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto md:mx-0">
              Supplying high-performance valves for oil, gas, chemical and power
              industries worldwide.
            </p>

            <div className="mt-7 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
              <Link
                to="/products"
                className="bg-[#F59E0B] text-black px-5 sm:px-6 py-3 rounded-md font-semibold hover:opacity-90 transition active:scale-[0.98] text-sm sm:text-base"
              >
                View Products
              </Link>

              <Link
                to="/contact"
                className="border border-white px-5 sm:px-6 py-3 rounded-md hover:bg-white hover:text-black transition active:scale-[0.98] text-sm sm:text-base"
              >
                Request a Quote
              </Link>
            </div>
          </motion.div>

          {/* Mobile dual vertical carousel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-2 md:hidden w-full"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] p-2.5 sm:p-3">
              <div className="absolute top-0 left-0 w-full h-10 sm:h-12 bg-linear-to-b from-[#0F172A] to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-10 sm:h-12 bg-linear-to-t from-[#0F172A] to-transparent z-10 pointer-events-none" />

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 h-[300px] sm:h-[380px] overflow-hidden">
                <div className="overflow-hidden rounded-xl">
                  <div className="slider-slow space-y-2.5 sm:space-y-3">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                      <img
                        key={`m-slow-${index}`}
                        src={img}
                        alt="Valve"
                        className="w-full aspect-[4/5] rounded-xl shadow-lg object-cover"
                      />
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl">
                  <div className="slider-fast space-y-2.5 sm:space-y-3">
                    {[...sliderImages]
                      .reverse()
                      .concat([...sliderImages].reverse())
                      .map((img, index) => (
                        <img
                          key={`m-fast-${index}`}
                          src={img}
                          alt="Valve"
                          className="w-full aspect-[4/5] rounded-xl shadow-lg object-cover"
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Desktop dual vertical slider */}
          <div className="relative hidden md:block order-2">
            <div className="absolute top-0 left-0 w-full h-16 bg-linear-to-b from-[#0F172A] to-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-[#0F172A] to-transparent z-10" />

            <div className="grid grid-cols-2 gap-6 h-105 overflow-hidden">
              <div className="overflow-hidden">
                <div className="slider-slow space-y-6">
                  {[...sliderImages, ...sliderImages].map((img, index) => (
                    <img
                      key={`slow-${index}`}
                      src={img}
                      alt="Valve"
                      className="w-full rounded-xl shadow-lg object-cover"
                    />
                  ))}
                </div>
              </div>

              <div className="overflow-hidden">
                <div className="slider-fast space-y-6">
                  {[...sliderImages]
                    .reverse()
                    .concat([...sliderImages].reverse())
                    .map((img, index) => (
                      <img
                        key={`fast-${index}`}
                        src={img}
                        alt="Valve"
                        className="w-full rounded-xl shadow-lg object-cover"
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="flex justify-between items-end gap-4 mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A]">
              Our Product Range
            </h2>

            <Link
              to="/products"
              className="text-[#F59E0B] font-semibold hover:underline shrink-0 text-sm sm:text-base"
            >
              View All →
            </Link>
          </motion.div>

          {rangesLoading ? (
            <RangeCardsSkeleton />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {ranges.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                >
                  <Link
                    to={`/products?category=${encodeURIComponent(product.name)}`}
                    className="block bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-4 sm:p-6 group h-full"
                  >
                    <div className="h-28 sm:h-40 flex items-center justify-center mb-4 sm:mb-6">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-300"
                      />
                    </div>

                    <h3 className="text-sm sm:text-xl font-semibold text-center text-[#0F172A] leading-snug">
                      {product.name}
                    </h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="w-16 h-1 bg-[#F59E0B] mx-auto mb-6" />
          <motion.div {...fadeUp} className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A]">
              Why Choose Elite Valves
            </h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base max-w-2xl mx-auto">
              Reliable flow control solutions engineered for demanding industries.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center">
            {[
              {
                title: "Instant Response",
                desc: "Quick response in 30 minutes.",
              },
              {
                title: "25+ Years Experience",
                desc: "Proven expertise in industrial valve manufacturing.",
              },
              {
                title: "Global Export",
                desc: "Supplying valves to multiple countries worldwide.",
              },
              {
                title: "Custom Manufacturing",
                desc: "Tailored solutions to meet project-specific requirements.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="p-5 sm:p-6 rounded-xl border border-gray-100 hover:shadow-xl hover:border-[#F59E0B]/30 transition duration-300"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-[#0F172A] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2
            {...fadeUp}
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#0F172A] mb-8 sm:mb-12"
          >
            Our Certifications
          </motion.h2>

          {certsLoading ? (
            <CertsCarouselSkeleton />
          ) : certifications.length === 0 ? (
            <p className="text-center text-gray-500">No certifications yet.</p>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={prev}
                disabled={start === 0}
                aria-label="Previous certificates"
                className="absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 md:p-3 disabled:opacity-40 hover:scale-105 transition"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="overflow-hidden mx-10 sm:mx-12">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${(start * 100) / visibleCount}%)`,
                  }}
                >
                  {certifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveCert(item)}
                      className="shrink-0 px-2 box-border text-left"
                      style={{ flex: `0 0 ${100 / visibleCount}%` }}
                    >
                      <div className="bg-white border rounded-xl shadow hover:shadow-xl transition group h-full overflow-hidden">
                        <div className="bg-gray-50 p-3 sm:p-4 flex items-center justify-center min-h-48 sm:min-h-64">
                          <img
                            src={item.image_url}
                            alt={item.title || "Certificate"}
                            className="max-w-full max-h-56 sm:max-h-72 w-auto h-auto object-contain group-hover:scale-[1.03] transition duration-300"
                          />
                        </div>
                        {item.title && (
                          <p className="text-center text-sm font-medium text-[#0F172A] p-3 border-t">
                            {item.title}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={next}
                disabled={start >= maxStart}
                aria-label="Next certificates"
                className="absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 md:p-3 disabled:opacity-40 hover:scale-105 transition"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            {...fadeUp}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6"
          >
            Need Reliable Industrial Valves for Your Project?
          </motion.h2>

          <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
            Contact Elite Valves today for high-performance flow control
            solutions engineered to meet your industrial requirements.
          </p>

          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
            <Link
              to="/contact"
              className="bg-[#F59E0B] text-black px-6 sm:px-8 py-3 rounded-lg font-semibold hover:scale-105 transition duration-300 shadow-lg"
            >
              Request a Quote
            </Link>

            <Link
              to="/products"
              className="border border-white px-6 sm:px-8 py-3 rounded-lg hover:bg-white hover:text-black transition duration-300"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeCert && (
          <motion.div
            className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close certificate"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setActiveCert(null)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={activeCert.title || "Certificate"}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white/95 backdrop-blur border-b px-4 sm:px-5 py-3">
                <h3 className="font-semibold text-[#0F172A] text-sm sm:text-base truncate">
                  {activeCert.title || "Certificate"}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#0F172A] hover:bg-gray-100 transition"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50 flex items-center justify-center">
                <img
                  src={activeCert.image_url}
                  alt={activeCert.title || "Certificate"}
                  className="max-w-full h-auto object-contain"
                />
              </div>

              {activeCert.pdf_url && (
                <div className="p-4 sm:p-5 border-t flex justify-center">
                  <a
                    href={activeCert.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1E293B] transition"
                  >
                    <FileText size={16} />
                    Open PDF
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
