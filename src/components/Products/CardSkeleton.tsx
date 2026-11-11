import React from "react";

function CardSkeleton() {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-4 sm:p-5 w-full h-full animate-pulse shadow-xl flex flex-col justify-between">
      <div>
        <div className="relative w-full h-56 bg-zinc-50 rounded-2xl overflow-hidden mb-4 border border-zinc-200" />
        
        <div className="space-y-3 mb-6">
          <div className="h-5 bg-zinc-50 rounded-full w-4/5 border border-zinc-200" />
          <div className="h-3 bg-zinc-50 rounded-full w-1/2" />
        </div>
      </div>

      <div className="flex w-full justify-between items-center pt-4 border-t border-zinc-200">
        <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200" />
        <div className="flex flex-col items-end gap-1.5">
          <div className="h-3 bg-zinc-50 rounded-full w-14" />
          <div className="h-5 bg-zinc-50 rounded-full w-24 border border-zinc-200" />
        </div>
      </div>
    </div>
  );
}

export default CardSkeleton;
