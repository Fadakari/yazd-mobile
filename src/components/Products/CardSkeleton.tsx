function CardSkeleton() {
  return (
    <div className="flex h-full w-full animate-pulse flex-col rounded-[1.55rem] border-2 border-[#252923] bg-[#f7f5ef] p-3 shadow-[5px_6px_0_#252923] sm:p-4">
      <div className="relative min-h-[190px] overflow-hidden rounded-[1.2rem] border border-[#d8d2c7] bg-[#e6e2d8] sm:min-h-[235px] md:min-h-[255px]">
        <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-[#d9c6b4]" />
        <div className="absolute -bottom-10 -right-8 h-36 w-36 rounded-full border-[18px] border-[#c8b995]" />
      </div>
      <div className="mt-5 flex flex-1 flex-col gap-3 px-1">
        <div className="h-3 w-1/3 rounded-full bg-[#c8b995]" />
        <div className="h-6 w-4/5 rounded-lg bg-[#e6e2d8]" />
        <div className="h-4 w-1/2 rounded-lg bg-[#e6e2d8]" />
        <div className="mt-auto flex items-center justify-between border-t border-[#d8d2c7] pt-4">
          <div className="h-6 w-24 rounded-lg bg-[#e6e2d8]" />
          <div className="h-10 w-28 rounded-full bg-[#c8b995]" />
        </div>
      </div>
    </div>
  );
}

export default CardSkeleton;
