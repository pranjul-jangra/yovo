import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaYoutube, FaTelegram, FaGlobe } from "react-icons/fa";

export const platformOptions = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'GitHub', 'YouTube', 'Telegram', 'Other'];

export const platformIcons = {
    Facebook: <FaFacebook className="text-blue-600" />,
    Twitter: <FaTwitter className="text-sky-500" />,
    Instagram: <FaInstagram className="text-pink-500" />,
    LinkedIn: <FaLinkedin className="text-blue-800" />,
    GitHub: <FaGithub className="text-gray-500" />,
    YouTube: <FaYoutube className="text-red-600" />,
    Telegram: <FaTelegram className="text-blue-400" />,
    Other: <FaGlobe className="text-gray-500" />,
};