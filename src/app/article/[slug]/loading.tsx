export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6" dir="rtl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4 bg-white border border-zinc-200/90 p-6 md:p-10 rounded-3xl space-y-5 animate-pulse">
          <div className="h-8 w-3/4 bg-slate-800 rounded-xl" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-28 bg-slate-800 rounded-lg" />
            <div className="h-4 w-20 bg-slate-800 rounded-lg" />
          </div>
          <div className="h-4 w-full bg-slate-800/60 rounded-lg mt-4" />
          <div className="w-full h-80 bg-slate-800/80 rounded-2xl" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full bg-slate-800/60 rounded-lg" />
            <div className="h-4 w-5/6 bg-slate-800/60 rounded-lg" />
            <div className="h-4 w-2/3 bg-slate-800/60 rounded-lg" />
          </div>
        </div>

        <div className="w-full md:w-1/4 space-y-4">
          <div className="bg-white border border-zinc-200/90 p-5 rounded-2xl space-y-4 animate-pulse">
            <div className="h-6 w-32 bg-slate-800 rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-800/60 rounded-lg" />
              <div className="h-4 w-3/4 bg-slate-800/60 rounded-lg" />
              <div className="h-4 w-5/6 bg-slate-800/60 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
