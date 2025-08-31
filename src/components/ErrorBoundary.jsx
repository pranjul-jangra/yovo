import { Link } from "react-router-dom";
import useThemeStyles from "../hooks/useThemeStyles";

export function GlobalErrorFallback() {
    const { bgColor, modalsBg, border, grayText, shadow } = useThemeStyles();

    return (
        <main className={`min-h-screen flex items-center justify-center px-4 ${bgColor}`}>
            <div className={`text-center rounded-3xl p-10 max-w-xl w-full shadow-md ${modalsBg} border ${border} shadow-md ${shadow}`}>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Something Went Wrong</h2>
                <p className={`text-sm mb-4 ${grayText}`}>We're sorry for the inconvenience. Please try refreshing the page or report the issue.</p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        aria-label="Refresh page"
                    >
                        Refresh Page
                    </button>

                    <Link
                        to="/settings/feedback"
                        className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                        aria-label="Report issue"
                    >
                        Give Feedback
                    </Link>
                </div>
            </div>
        </main>
    );
}