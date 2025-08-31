export default function ProfileInfoSkeleton() {
  return (
    <>
      {/* Profile image + info */}
      <section className="mt-12 flex justify-center items-center flex-wrap gap-10 px-4">
        <div className="w-28 h-28 rounded-full bg-gray-300 animate-pulse" />

        <div className="max-w-2xl space-y-2 w-full sm:w-auto">
          <div className="h-5 w-40 rounded-md bg-gray-300 animate-pulse" />
          <div className="h-4 w-28 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-4 w-64 rounded-md bg-gray-200 animate-pulse" />
          <div className="h-4 w-56 rounded-md bg-gray-200 animate-pulse" />

          <div className="flex items-center gap-2 mt-2">
            <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse" />
            <div className="h-4 w-28 rounded-md bg-gray-200 animate-pulse" />
          </div>

          {/* Social icons */}
          <div className="flex gap-4 mt-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-5 w-5 rounded-full bg-gray-300 animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="flex justify-center items-center gap-24 max-sm:gap-12 mt-8">
        {["Followers", "Following", "Posts"].map((label, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="h-6 w-10 bg-gray-300 rounded-md animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded-md mt-1 animate-pulse" />
          </div>
        ))}
      </section>

      {/* Action buttons */}
      <section className="flex justify-center items-center gap-16 max-sm:gap-12 mt-8">
        <div className="w-32 h-11 rounded-full bg-gray-300 animate-pulse" />
        <div className="w-32 h-11 rounded-full bg-gray-300 animate-pulse" />
      </section>
    </>
  );
}
