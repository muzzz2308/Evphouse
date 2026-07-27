import { Phone, Mail } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-[#0F172A] text-gray-300 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between gap-3">
        <a
          href="tel:+923399926666"
          className="flex items-center gap-1.5 shrink-0 hover:text-[#F59E0B] transition"
        >
          <Phone size={13} className="text-[#F59E0B] shrink-0" />
          <span className="font-medium text-white/90">+92-339-9926666</span>
        </a>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Mail size={14} className="text-[#F59E0B]" />
          <span>elitevalves6@gmail.com</span>
        </div>

        <div className="min-w-0 text-right md:text-left truncate text-[10px] sm:text-xs md:text-sm">
          Authorize Distributor of IMGV and TFW
        </div>
      </div>
    </div>
  );
}
