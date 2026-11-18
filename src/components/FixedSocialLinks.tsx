import { FaInstagram, FaWhatsapp, FaTelegramPlane, FaPhoneAlt } from "react-icons/fa";

const FixedSocialLinks = () => {
  const callPhone = "09123669839";
  const messengerPhone = "09138591838";
  const instagramId = "tolidiakhoondi";

  return (
    <div className="fixed left-3.5 bottom-20 md:bottom-6 md:left-6 flex flex-col items-center gap-3.5 z-50 select-none">
      {/* ۱. تماس مستقیم تلفنی (مشاوره و خرید) */}
      <a
        href={`tel:${callPhone}`}
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-cyan-600 to-sky-400 text-white shadow-lg shadow-cyan-600/40 hover:shadow-xl hover:shadow-cyan-500/60 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white ring-4 ring-cyan-400/25"
        aria-label="تماس تلفنی با کارشناس مشاوره"
      >
        <FaPhoneAlt className="size-5 md:size-6 animate-pulse" />
        <span className="absolute left-15 md:left-17 whitespace-nowrap bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-xl opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-hover:translate-x-1 transition-all duration-300 shadow-xl border border-white/10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>تماس مستقیم مشاوره: ۰۹۱۲۳۶۶۹۸۳۹</span>
        </span>
      </a>

      {/* ۲. ایتا با آیکون برداری رسمی */}
      <a
        href={`https://eitaa.com/${instagramId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-lg shadow-orange-500/35 hover:shadow-xl hover:shadow-orange-500/60 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-orange-400 ring-4 ring-orange-400/25 p-2 sm:p-2.5"
        aria-label="ارتباط در پیام‌رسان ایتا"
      >
        <img
          src="/eitaa.svg"
          alt="ایتا"
          className="w-full h-full object-contain"
        />
        <span className="absolute left-15 md:left-17 whitespace-nowrap bg-orange-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-hover:translate-x-1 transition-all duration-300 shadow-xl">
          پیام‌رسان ایتا (۰۹۱۳۸۵۹۱۸۳۸)
        </span>
      </a>

      {/* ۳. تلگرام */}
      <a
        href={`https://t.me/+98${messengerPhone.slice(1)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/40 hover:shadow-xl hover:shadow-sky-500/60 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white ring-4 ring-sky-400/25"
        aria-label="ارتباط در تلگرام"
      >
        <FaTelegramPlane className="size-6 md:size-7" />
        <span className="absolute left-15 md:left-17 whitespace-nowrap bg-sky-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-hover:translate-x-1 transition-all duration-300 shadow-xl">
          ارتباط در تلگرام (۰۹۱۳۸۵۹۱۸۳۸)
        </span>
      </a>

      {/* ۴. واتساپ */}
      <a
        href={`https://wa.me/98${messengerPhone.slice(1)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/60 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white ring-4 ring-emerald-400/25"
        aria-label="ارتباط در واتساپ"
      >
        <FaWhatsapp className="size-6 md:size-7" />
        <span className="absolute left-15 md:left-17 whitespace-nowrap bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-hover:translate-x-1 transition-all duration-300 shadow-xl">
          ارتباط در واتساپ (۰۹۱۳۸۵۹۱۸۳۸)
        </span>
      </a>

      {/* ۵. اینستاگرام */}
      <a
        href={`https://www.instagram.com/${instagramId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/40 hover:shadow-xl hover:shadow-rose-500/60 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white ring-4 ring-rose-400/25"
        aria-label="اینستاگرام گروه تولیدی آخوندی"
      >
        <FaInstagram className="size-6 md:size-7" />
        <span className="absolute left-15 md:left-17 whitespace-nowrap bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-hover:translate-x-1 transition-all duration-300 shadow-xl">
          اینستاگرام: tolidiakhoondi
        </span>
      </a>
    </div>
  );
};

export default FixedSocialLinks;
