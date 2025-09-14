export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="mountain-card p-6 elevation-shadow animate-pulse">
          <div className="flex items-center justify-center mb-3">
            <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
          </div>
          <div className="text-center">
            <div className="h-8 w-16 bg-slate-200 rounded-md mb-2 mx-auto"></div>
            <div className="h-4 w-20 bg-slate-200 rounded-md mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="mountain-card p-8 h-full elevation-shadow animate-pulse">
          <div className="h-6 w-3/4 bg-slate-200 rounded-md mb-3"></div>
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-slate-200 rounded-md"></div>
            <div className="h-4 w-full bg-slate-200 rounded-md"></div>
            <div className="h-4 w-2/3 bg-slate-200 rounded-md"></div>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-4">
              <div className="h-4 w-20 bg-slate-200 rounded-md"></div>
              <div className="h-4 w-16 bg-slate-200 rounded-md"></div>
            </div>
            <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TrainingPhasesSkeleton() {
  return (
    <div className="mountain-card p-8 elevation-shadow mb-8 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-md mb-6"></div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="h-5 w-32 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-8 bg-slate-200 rounded-md"></div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ContentSkeleton() {
  return (
    <div className="mountain-card p-8 md:p-12 elevation-shadow animate-pulse">
      <div className="h-10 w-3/4 bg-slate-200 rounded-md mb-6"></div>
      <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-200">
        <div className="h-4 w-20 bg-slate-200 rounded-md"></div>
        <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
        <div className="h-4 w-16 bg-slate-200 rounded-md"></div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-full bg-slate-200 rounded-md"></div>
            <div className="h-4 w-full bg-slate-200 rounded-md"></div>
            <div className="h-4 w-3/4 bg-slate-200 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <section className="pt-16 pb-12 animate-pulse">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-slate-200 rounded-2xl"></div>
        </div>
        <div className="h-14 w-3/4 bg-slate-200 rounded-md mb-6 mx-auto"></div>
        <div className="h-6 w-full max-w-2xl bg-slate-200 rounded-md mb-4 mx-auto"></div>
        <div className="h-6 w-4/5 max-w-2xl bg-slate-200 rounded-md mb-12 mx-auto"></div>
        <div className="h-12 w-40 bg-slate-200 rounded-xl mx-auto"></div>
      </div>
    </section>
  )
}