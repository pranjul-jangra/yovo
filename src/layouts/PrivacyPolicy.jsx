import { Link } from "react-router-dom";
import useThemeStyles from "../hooks/useThemeStyles";

export default function PrivacyPolicy() {
    const { bgColor, grayText } = useThemeStyles();

    return (
        <div className={`${bgColor} min-h-screen py-10 px-4`}>
            <div className={`max-w-5xl mx-auto`}>
                <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                    <p className={grayText}>
                        This Privacy Policy explains how we collect, use, and protect your personal data when you use our social media platform.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
                    <p className={grayText}>
                        We may collect personal information such as your name, email, device info, IP address, content you post, and your interactions on the platform.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
                    <p className={grayText}>
                        Your data helps us personalize your experience, improve our services, communicate with you, and ensure safety and compliance.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
                    <p className={grayText}>
                        We do not sell your data. We may share it with trusted partners or law enforcement when required to operate the platform or comply with legal obligations.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
                    <p className={grayText}>
                        We use industry-standard encryption and security protocols to protect your information. However, no system is 100% secure.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
                    <p className={grayText}>
                        You have the right to access, update, or delete your personal data. You may do so from your account settings or by contacting support.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">7. Cookies and Tracking</h2>
                    <p className={grayText}>
                        We use cookies and similar technologies to enhance your experience, analyze usage, and serve relevant content.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
                    <p className={grayText}>
                        We may update this Privacy Policy. Your continued use of the platform indicates acceptance of the changes.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
                    <p className={grayText}>
                        For privacy concerns or questions, please reach out to our support team through the <Link to={'/settings/feedback'} className="text-blue-600 underline">contact</Link> section.
                    </p>
                </section>
            </div>
        </div>
    );
}
