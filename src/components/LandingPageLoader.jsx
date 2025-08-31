import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCircleNotch } from "react-icons/fa";
import logo from "/yovo.png";
import useThemeStyles from "../hooks/useThemeStyles";

const taglines = [
    "Connecting the world...",
    "Warming up your social space...",
    "Brewing fresh vibes...",
    "Building your experience...",
    "Just a moment, almost there...",
];

export default function LandingPageLoader() {
    const [currentTagline, setCurrentTagline] = useState(0);
    const { grayText, shadow } = useThemeStyles();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTagline((prev) => (prev + 1) % taglines.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full z-50 flex items-center justify-center bg-gradient-to-br transition-colors">
            <div className="flex flex-col items-center space-y-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`p-6 rounded-2xl shadow-xl ${shadow} flex items-center justify-center w-24 h-24`}
                >
                    <img src={logo} alt="Yovo Logo" className="w-12 h-12" />
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentTagline}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.6 }}
                        className={`text-center text-sm sm:text-base px-4 font-medium ${grayText}`}
                    >
                        {taglines[currentTagline]}
                    </motion.p>
                </AnimatePresence>

                <FaCircleNotch className="animate-spin text-xl text-gray-500" />
            </div>
        </div>
    );
}