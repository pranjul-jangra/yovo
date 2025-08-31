export default function ProfilePostsSkeleton() {
  return (
    <section className="mt-8 grid grid-cols-3 gap-3 max-w-4xl mx-auto max-sm:grid-cols-2">
      {Array(12).fill(0).map((_, i) => (
        <div key={i} className="w-full h-44 bg-gray-300 rounded-xl animate-pulse" />
      ))}
    </section>
  );
}
