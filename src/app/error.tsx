"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <h2 className="text-2xl font-semibold text-red-600 mb-2">
        Something went wrong!
      </h2>

      <p className="text-gray-600 max-w-md mb-6">
        {error?.message || "Unexpected error occurred."}
      </p>

      <button
        onClick={() => reset()}
        className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
