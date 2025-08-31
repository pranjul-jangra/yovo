import { useMemo } from "react";
import { IoIosSunny } from "react-icons/io";
import useThemeStore from "../store/themeStore";
import { FiMoon } from "react-icons/fi";
import useThemeStyles from "../hooks/useThemeStyles";


export default function Theme() {
    const { bgColor, modalsBg, shadow, border, grayText } = useThemeStyles();
    const { theme, setTheme } = useThemeStore();

    const themeClassMap = useMemo(() => ({
        themeBorder: "border-blue-500 shadow-md",
        defaultBorder: "border-transparent hover:border-gray-300",
    }), [theme]);


    return (
        <main className={`min-h-screen flex items-center justify-center ${bgColor} px-4`}>
            <div className={`max-w-xl w-full ${modalsBg} rounded-3xl shadow-md ${shadow} border ${border} p-8`}>
                <h2 className="text-2xl font-bold mb-2">Choose Your Theme</h2>
                <p className={`text-sm mb-6 ${grayText}`}>Select a theme to personalize your experience.</p>

                <div className="*:rounded-xl *:border-2 *:p-4 *:w-48 *:flex *:items-center *:justify-start *:gap-2 *:font-medium *:transition">
                    <button
                        onClick={() => setTheme("light")}
                        className={`${theme === "light" ? themeClassMap.themeBorder : themeClassMap.defaultBorder} bg-white text-black mb-4`}
                    >
                        <IoIosSunny className="text-xl" /> Light
                    </button>

                    <button
                        onClick={() => setTheme("dark")}
                        className={`${theme === "dark" ? themeClassMap.themeBorder : themeClassMap.defaultBorder} bg-neutral-900 text-white`}
                    >
                        <FiMoon className="text-lg" /> Dark
                    </button>
                </div>
            </div>
        </main>
    );
}
