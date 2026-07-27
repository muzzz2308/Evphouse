import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminLoginModal from "./AdminLoginModal";

export default function Footer() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const scrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleAdminClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/admin");
      scrollTop();
      return;
    }
    setLoginOpen(true);
  };

  return (
    <>
      <footer className="bg-[#1E293B] text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Elite Valves</h3>
            <p className="text-sm leading-relaxed">
              Manufacturer and global supplier of high-quality industrial valves
              engineered for oil, gas, chemical and power industries.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" onClick={scrollTop} className="hover:text-[#F59E0B] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  onClick={scrollTop}
                  className="hover:text-[#F59E0B] transition"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={scrollTop}
                  className="hover:text-[#F59E0B] transition"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={scrollTop}
                  className="hover:text-[#F59E0B] transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleAdminClick}
                  className="hover:text-[#F59E0B] transition text-left"
                >
                  Admin
                </button>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <h4 className="text-white font-semibold mb-4">Contact Information</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                <span>+92-339-9926666</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                <span>elitevalves6@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                <span>Industrial Area, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-4 text-center text-sm px-4">
          © {new Date().getFullYear()} Elite Valves. All Rights Reserved.
        </div>
      </footer>

      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
