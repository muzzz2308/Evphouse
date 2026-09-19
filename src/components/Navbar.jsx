import { useEffect, useState } from "react";
import { Home, Package, Info, Phone, Mail } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: Phone },
];

function prefetchRoute(path) {
  if (path === "/products") {
    import("../pages/Products");
    import("../hooks/useProducts").then((m) => m.prefetchProducts());
  } else if (path === "/about") {
    import("../pages/About");
  } else if (path === "/contact") {
    import("../pages/Contact");
  }
}

const linkClass = ({ isActive }) =>
  `transition ${isActive ? "text-[#F59E0B]" : "hover:text-[#F59E0B]"}`;

const menuContainer = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
  closed: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const menuItem = {
  closed: { opacity: 0, x: -18 },
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 380, damping: 30 },
  },
};

function HamburgerIcon({ open }) {
  const line = "absolute left-1/2 -translate-x-1/2 block h-[2px] w-5 rounded-full bg-current";

  return (
    <span className="relative block w-5 h-[14px]" aria-hidden>
      <motion.span
        className={`${line} top-0`}
        animate={
          open
            ? { top: 6, rotate: 45 }
            : { top: 0, rotate: 0 }
        }
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className={`${line} top-[6px]`}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.18 }}
      />
      <motion.span
        className={`${line} bottom-0`}
        animate={
          open
            ? { bottom: 6, rotate: -45 }
            : { bottom: 0, rotate: 0 }
        }
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isItemActive = (item) => {
    if (item.end) return location.pathname === item.to;
    return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
  };

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        open
          ? "bg-[#0F172A] border-white/10"
          : "bg-[#1E293B]/95 backdrop-blur-md border-white/5 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 relative z-[70]">
        <Link to="/" onClick={() => setOpen(false)} className="min-w-0 group">
          <span className="block text-base sm:text-xl uppercase font-bold tracking-wide truncate text-white">
            Elite{" "}
            <span className="text-[#F59E0B] group-hover:brightness-110 transition">
              Valves
            </span>
          </span>
        </Link>

        <ul className="hidden md:flex gap-8 items-center text-white">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={linkClass}
            onMouseEnter={() => prefetchRoute("/products")}
            onFocus={() => prefetchRoute("/products")}
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            className={linkClass}
            onMouseEnter={() => prefetchRoute("/about")}
            onFocus={() => prefetchRoute("/about")}
          >
            About
          </NavLink>
          <Link
            to="/contact"
            className="bg-[#F59E0B] text-black px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
            onMouseEnter={() => prefetchRoute("/contact")}
            onFocus={() => prefetchRoute("/contact")}
          >
            RFQ
          </Link>
        </ul>

        <div className="md:hidden flex items-center gap-2">
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="h-10 px-3 rounded-full bg-[#F59E0B] text-black text-xs font-bold flex items-center justify-center active:scale-95 transition"
          >
            RFQ
          </Link>

          <motion.button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`relative w-11 h-11 rounded-full flex items-center justify-center border transition ${
              open
                ? "bg-[#F59E0B] border-[#F59E0B] text-[#0F172A]"
                : "bg-white/5 border-white/15 text-white hover:bg-white/10"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            whileTap={{ scale: 0.92 }}
          >
            <HamburgerIcon open={open} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden fixed inset-0 z-[60] bg-[#0F172A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="h-14" />

            <div className="h-[calc(100svh-3.5rem)] flex flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <motion.div
                className="flex-1 flex flex-col justify-center gap-2 py-4"
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuContainer}
              >
                {navItems.map((item, index) => {
                  const active = isItemActive(item);
                  return (
                    <motion.div key={item.to} variants={menuItem}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => prefetchRoute(item.to)}
                        onFocus={() => prefetchRoute(item.to)}
                        className={`group flex items-center gap-4 rounded-2xl px-3 py-3.5 transition ${
                          active ? "bg-white/5" : "hover:bg-white/[0.03]"
                        }`}
                      >
                        <span
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition ${
                            active
                              ? "bg-[#F59E0B] text-[#0F172A] border-[#F59E0B]"
                              : "bg-white/5 text-white border-white/10 group-hover:border-[#F59E0B]/40"
                          }`}
                        >
                          <item.icon size={20} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span
                            className={`block text-xl font-semibold tracking-tight ${
                              active ? "text-[#F59E0B]" : "text-white"
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="block text-xs text-gray-400 mt-0.5">
                            {index === 0 && "Back to homepage"}
                            {index === 1 && "Browse our catalog"}
                            {index === 2 && "Our story & expertise"}
                            {index === 3 && "Get in touch"}
                          </span>
                        </span>
                        <span
                          className={`text-sm font-medium tabular-nums ${
                            active ? "text-[#F59E0B]" : "text-white/25"
                          }`}
                        >
                          0{index + 1}
                        </span>
                      </NavLink>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-3 pt-2 border-t border-white/10"
              >
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+923399926666"
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-xs text-gray-200 active:bg-white/10"
                  >
                    <Phone size={14} className="text-[#F59E0B]" />
                    Call
                  </a>
                  <a
                    href="mailto:elitevalves6@gmail.com"
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-xs text-gray-200 active:bg-white/10"
                  >
                    <Mail size={14} className="text-[#F59E0B]" />
                    Email
                  </a>
                </div>

                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center bg-[#F59E0B] text-[#0F172A] py-3.5 rounded-2xl font-bold active:scale-[0.99] transition"
                >
                  Request a Quote
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
