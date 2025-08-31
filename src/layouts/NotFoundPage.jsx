import { Link } from "react-router-dom";
import useThemeStyles from "../hooks/useThemeStyles";

export default function NotFoundPage() {
  const { bgColor, grayText, modalsBg, border, shadow } = useThemeStyles();

  return (
    <main className={`min-h-screen flex items-center justify-center px-4 ${bgColor}`}>
      <div className={`text-center rounded-3xl p-10 max-w-xl w-full shadow-md ${shadow} ${modalsBg} border ${border}`}>
        <h1 className={`text-6xl font-bold mb-4 text-red-500`}>404</h1> 
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className={`text-sm mb-6 ${grayText}`}>
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link to={-1} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Go Back
          </Link>
          <Link to="/home" className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
