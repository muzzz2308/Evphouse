import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { usePageSkeleton } from "../hooks/usePageSkeleton";
import { ContactSkeleton } from "../components/Skeleton";

export default function Contact() {
  const pageLoading = usePageSkeleton();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setForm({ name: "", company: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (pageLoading) {
    return <ContactSkeleton />;
  }

  const inputClass =
    "w-full bg-white/10 border border-white/20 px-4 py-3 rounded-lg placeholder-gray-300 focus:outline-none focus:border-[#F59E0B] text-sm sm:text-base";

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white">
      <div className="text-center py-12 sm:py-20 px-4 sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
        >
          Let’s Build Something Reliable
        </motion.h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
          Contact our industrial valve specialists for custom solutions and
          high-performance engineered products.
        </p>
      </div>

      <div className="w-full h-56 sm:h-80 md:h-112.5 mb-8 sm:mb-10">
        <iframe
          title="Elite Valve Location"
          src="https://www.google.com/maps?q=Karachi%20Pakistan&output=embed"
          width="100%"
          height="100%"
          loading="lazy"
          className="border-0"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 grid md:grid-cols-2 gap-10 md:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8 sm:space-y-10"
        >
          {[
            {
              icon: MapPin,
              title: "Head Office",
              body: "Industrial Zone, Karachi, Pakistan",
            },
            {
              icon: Mail,
              title: "Email",
              body: "elitevalves6@gmail.com",
            },
            {
              icon: Phone,
              title: "Phone",
              body: "+92-339-9926666",
            },
            {
              icon: Clock,
              title: "Working Hours",
              body: "Mon – Sat | 9:00 AM – 6:00 PM",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-3">
              <div className="text-[#F59E0B] mt-1">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#F59E0B]">
                  {title}
                </h3>
                <p className="text-gray-300 mt-1 text-sm sm:text-base">{body}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 p-5 sm:p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Request a Quotation</h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="text"
              name="company"
              placeholder="Company Name"
              required
              value={form.company}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="email"
              name="email"
              placeholder="Business Email"
              required
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
            />

            <textarea
              name="message"
              rows="4"
              placeholder="Tell us your requirements..."
              required
              value={form.message}
              onChange={handleChange}
              className={inputClass}
            />

            {status === "success" && (
              <p className="text-sm text-emerald-300">Request submitted successfully.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-300">
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-[#F59E0B] text-black py-3 rounded-lg font-semibold hover:scale-[1.02] transition duration-300 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Submit Request"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
