export default function Loading() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center px-4">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        <h2 className="text-lg font-semibold text-gray-900">
          Loading auth page...
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we prepare your login/register screen.
        </p>
      </div>
    </section>
  );
}
