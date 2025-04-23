export default function ErrorPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-xl text-gray-700">
        Oops! The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
      >
        Go Home
      </a>
    </div>
  );
}
