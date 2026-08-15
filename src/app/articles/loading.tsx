import { BlogCardSkeleton } from "@/components/BlogCard";

function loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 w-full">
      {[...Array(9)].map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default loading;
