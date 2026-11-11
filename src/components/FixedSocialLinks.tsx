import { FaInstagram, FaWhatsapp } from "react-icons/fa";

const FixedSocialLinks = () => {
  return (
    <div className="fixed left-4 bottom-24 md:bottom-6 md:left-6 flex flex-col items-center gap-3 z-40 md:z-50 select-none">
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="اینستاگرام خوش طعم"
        className="group relative flex items-center justify-center bg-white text-amber-400 border border-amber-400/40 hover:border-amber-400 hover:text-white w-10 h-10 md:w-11 md:h-11 rounded-2xl shadow-xl shadow-zinc-900/10 transition-all duration-300 hover:scale-105 backdrop-blur-md"
      >
        <FaInstagram size={20} />
        <span className="absolute left-14 whitespace-nowrap bg-white text-amber-300 border border-zinc-200 text-xs font-bold px-3 py-1.5 rounded-xl opacity-0 hidden md:block group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 pointer-events-none shadow-xl">
          صفحه اینستاگرام خوش‌طعم
        </span>
      </a>

      <a
        href="https://wa.me/09011517606"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="واتساپ خوش طعم"
        className="group relative flex items-center justify-center bg-white text-emerald-400 border border-emerald-400/40 hover:border-emerald-400 hover:text-white w-10 h-10 md:w-11 md:h-11 rounded-2xl shadow-xl shadow-zinc-900/10 transition-all duration-300 hover:scale-105 backdrop-blur-md"
      >
        <FaWhatsapp size={20} />
        <span className="absolute left-14 whitespace-nowrap bg-white text-emerald-300 border border-emerald-500/20 text-xs font-bold px-3 py-1.5 rounded-xl opacity-0 hidden md:block group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 pointer-events-none shadow-xl">
          پشتیبانی واتساپ
        </span>
      </a>
    </div>
  );
};

export default FixedSocialLinks;
