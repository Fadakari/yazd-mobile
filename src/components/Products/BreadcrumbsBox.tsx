import Link from "next/link";
import { ReactNode } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string; // اگر نباشد یعنی مرحله‌ی فعلی است و لینک نیست
};

type BreadcrumbsBoxProps = {
  title?: string;
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
};

function BreadcrumbsBox({
  title,
  items,
  separator = "/",
  className = "",
}: BreadcrumbsBoxProps) {
  if (!items.length) return null;

  return (
    <div className={`pb-5 pt-3 ${className}`}>
      <div className="w-full rounded-2xl border border-[#ded9ce] bg-[#eeebe3] px-4 py-3">
        <div className="container mx-auto flex items-center gap-3">
          {/* {title && <strong className="text-base">{title}</strong>} */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#777568] sm:text-sm">
            {items.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1">
                {idx > 0 && <span>{separator}</span>}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[#59634f]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-[#252923]">
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreadcrumbsBox;
