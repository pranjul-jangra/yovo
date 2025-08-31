import { useState } from "react";
import { FaFacebook, FaTwitter, FaWhatsapp, FaLink } from "react-icons/fa";
import useThemeStyles from "../hooks/useThemeStyles";
import { motion } from "motion/react";
import { IoMdClose } from "react-icons/io";
import { IoShareSocial } from "react-icons/io5";


const SharePost = ({ postId, onClose, onShare }) => {
    const { modalsBg, border, grayText, shadow, grayIcon } = useThemeStyles();

    const postUrl = `${import.meta.env.VITE_FRONTEND_URL}/post/${postId}`;
    const [copied, setCopied] = useState(false);

    // Copy to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(postUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.section
            initial={{ background: 'rgba(0,0,0,0.01)' }}
            animate={{ background: 'rgba(0,0,0,0.3)' }}
            exit={{ background: 'rgba(0,0,0,0.01)' }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            data-lenis-prevent
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={e => e.stopPropagation()}
                className={`w-full max-w-2xl space-y-4 flex flex-col justify-between overflow-hidden rounded-2xl p-4 ${modalsBg} ${shadow} border ${border} relative`}
            >
                {/* Close Button */}
                <button onClick={onClose} className={`absolute top-3 right-3 text-xl hover:opacity-75`}>
                    <IoMdClose />
                </button>

                <p className="text-xl mb-4 text-center">Share</p>
                <span className={`p-5 mx-auto border ${border} rounded-full opacity-55`}>
                    <IoShareSocial className={`text-6xl ${grayIcon} box-content -translate-x-0.5`} />
                </span>

                {/* Share Options */}
                <div className="flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={() => onShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`)}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <FaFacebook size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=Check this out!`)}
                        className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600"
                    >
                        <FaTwitter size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onShare(`https://wa.me/?text=${encodeURIComponent(postUrl)}`)}
                        className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                    >
                        <FaWhatsapp size={20} />
                    </button>
                </div>

                {/* URL Bar with Copy Button */}
                <div className={`flex items-center border ${border} rounded-lg overflow-hidden`}>
                    <input type="text" value={postUrl} readOnly className={`flex-1 p-2 bg-transparent ${grayText} outline-none`} />
                    <button onClick={handleCopy} className={`px-3 py-2 ${grayText}`} type="button" title="Copy link">
                        {copied ? "Copied!" : <FaLink />}
                    </button>
                </div>
            </motion.div>
        </motion.section>
    );
};

export default SharePost;
