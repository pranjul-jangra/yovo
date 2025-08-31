import useThemeStore from "../store/themeStore"

// All theme based styling variables
export default function useThemeStyles() {
    const { theme } = useThemeStore();

    return {
        bgColor: theme === 'light' ? 'bg-white text-black' : 'bg-black text-white',
        navBg: theme === 'light' ? "bg-zinc-200 text-black" : "bg-neutral-950 text-white",
        tagsBg: theme === "light" ? "bg-gray-200/70" : "bg-zinc-900",
        modalsBg: theme === 'light' ? "bg-white" : "bg-neutral-950",
        selectedContainerBg: theme === 'light' ? "bg-gray-200" : "bg-gray-800",
        loaderBg: theme === 'light' ? "bg-black" : "bg-white",
        hoverBg: theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-900",
        successSubmitionBg: theme === 'light' ? "bg-green-50" : "bg-green-900/20",
        
        blueText: theme === 'light' ? "text-blue-600" : "text-blue-500",
        grayText: theme === 'light' ? 'text-gray-600' : 'text-gray-400',
        grayIcon: theme === 'light' ? "text-gray-300" : "text-gray-700",
       
        shadow: theme === 'light' ? 'shadow-gray-200' : 'shadow-gray-900/45',
        greenBorder: theme === 'light' ? 'border-green-300' : 'border-green-400',
        border: theme === 'light' ? 'border-gray-300' : 'border-white/10',
        buttonStyle: theme === "light" ? "bg-black/85 hover:bg-black" : "bg-gray-700 hover:bg-gray-700/90",
        followedButton: theme === "light" ? "bg-black/45 text-black" : "bg-gray-800/30",
        greenButtonStyle: theme === "light" ? "bg-green-200 hover:bg-green-200/80" : "bg-green-900/80 hover:bg-green-900/70",

        // Unthemed styles
        blueButtonBg: "bg-blue-600 hover:bg-blue-700",
        grayButtonBg: theme === 'light' ? "bg-blue-50 border-blue-200" : "bg-gray-950 border-gray-800",
        redButtonBg: theme === 'light' ? "bg-red-50 text-red-700 border-red-200" : "bg-red-500/10 border-red-800 text-red-500",
        yellowButtonBg: theme === 'light' ? "bg-yellow-50 text-yellow-600 border-yellow-200" : "bg-yellow-500/10 text-yellow-600 border-yellow-700",
    };
}
