export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" /> 
          <div className="space-y-3">
            <div className="h-12 w-full animate-pulse rounded-md bg-gray-200" /> 
            <div className="h-12 w-4/5 animate-pulse rounded-md bg-gray-200" />
            <div className="h-12 w-3/4 animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" /> 
          </div>
          <div className="h-12 w-32 animate-pulse rounded-full bg-gray-200" /> 
        </div>

        <div className="relative">
          <div className="aspect-[4/5] w-full animate-pulse rounded-3xl bg-gray-200 shadow-sm" />
          
          <div className="absolute -bottom-6 -left-6 w-64 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
             <div className="mb-3 h-3 w-24 animate-pulse rounded bg-gray-200" />
             <div className="flex gap-2">
                <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-100" />
             </div>
          </div>
        </div>
      </section>

      <section className="mt-32">
        <div className="mb-10 space-y-3">
          <div className="h-8 w-64 animate-pulse rounded-md bg-gray-200" /> 
          <div className="h-4 w-80 animate-pulse rounded bg-gray-100" /> 
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="aspect-square w-full animate-pulse rounded-2xl bg-gray-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/4 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}