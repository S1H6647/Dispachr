import { Link } from "react-router-dom";

export default function ErrorPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
            <h1 className="text-7xl font-bold text-gray-800">404</h1>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-gray-800 sm:text-7xl">
                Page not found
            </h1>

            <p className="mt-4 text-xl text-gray-600 max-w-md">
                The page you’re looking for doesn’t exist or might have been
                moved.
            </p>

            <div className="mt-8">
                <Link
                    to="/auth/signin"
                    className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
                >
                    Go Back
                </Link>
            </div>
        </div>
    );
}

