import React from "react";
import CourseCard from "./CourseCard";

export default function CourseSection({ products, title }: { products: any[], title: string }) {
  return (
    <section className="container mx-auto px-4 py-12 bg-[#f5f7f9] rounded-[2rem] my-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <h2 className="text-2xl font-black text-[#12465a]">{title}</h2>
        {/* این بخش (دوره ها / مینی دوره ها) صرفا ظاهری است */}
        <div className="flex bg-white p-1 rounded-full shadow-inner border border-gray-100">
            <button className="bg-[#12465a] text-white px-6 py-2 rounded-full text-sm font-bold">دوره ها</button>
            <button className="text-gray-500 px-6 py-2 rounded-full text-sm font-bold">مینی دوره ها</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.slice(0, 3).map((prod) => (
            <CourseCard key={prod.id} item={prod} />
        ))}
      </div>
    </section>
  );
}