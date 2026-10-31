import { FaInstagram } from "react-icons/fa";

const FixedSocialLinks = () => {
  return (
    <div className="fixed left-4 bottom-24 md:bottom-5 md:left-5 flex flex-col items-center gap-3 z-40 md:z-50">
      <a
        href="https://www.instagram.com/de.hafezimoghadam"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center bg-white text-[#dd2a7b] w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md hover:shadow-xl transition-all duration-300"
        title="اینستاگرام حافظ دارو"
      >
        <FaInstagram size={22} />
        <span className="absolute left-14 whitespace-nowrap bg-[#dd2a7b] text-white text-sm font-medium px-3 py-1 rounded-lg opacity-0 hidden md:block group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
          اینستاگرام: de.hafezimoghadam
        </span>
      </a>
    </div>
  );
};

export default FixedSocialLinks;
