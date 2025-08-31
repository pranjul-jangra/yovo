import { Link } from "react-router-dom";
import useThemeStyles from "../hooks/useThemeStyles";

export default function TermsAndConditions() {
    const { bgColor, grayText } = useThemeStyles();

    return (
        <main className={`${bgColor} min-h-screen py-10 px-4`}>
            <div className={`max-w-5xl mx-auto`}>
                <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions</h1>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                    <p className={grayText}>
                        By accessing or using our platform, you agree to be bound by these Terms and Conditions and our <Link to={'/settings/privacy'} className="text-blue-600 underline">Privacy Policy</Link>. If you do not agree, you must not use the platform.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
                    <p className={grayText}>
                        You must be at least 13 years old to use this platform. By using our services, you represent and warrant that you meet the age requirement.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">3. User Conduct</h2>
                    <p className={grayText}>
                        You agree not to engage in any behavior that may be considered abusive, harassing, harmful, or illegal. Any violations may result in account suspension or termination.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">4. Content Ownership</h2>
                    <p className={grayText}>
                        You retain ownership of your content but grant us a non-exclusive, royalty-free license to use, distribute, and display it on our platform as necessary to operate and improve our services.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">5. Account Security</h2>
                    <p className={grayText}>
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">6. Termination</h2>
                    <p className={grayText}>
                        We reserve the right to suspend or terminate your access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
                    <p className={grayText}>
                        We may update these Terms and Conditions at any time. Continued use of the platform constitutes your acceptance of the revised terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
                    <p className={grayText}>
                        If you have any questions or concerns about these Terms, please contact our support team via the <Link to={'/settings/feedback'} className="text-blue-600 underline">contact</Link> section.
                    </p>
                </section>
            </div>
        </main>
    );
}
