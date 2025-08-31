import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import useThemeStyles from "../hooks/useThemeStyles";
import useLoaderStore from "../store/loaderStore";
import interceptor from "../middleware/axiosInterceptor";

export default function SendLink() {
    const { modalsBg, bgColor, grayText, shadow, border, buttonStyle } = useThemeStyles();
    const { setScreenLoader } = useLoaderStore();
    const location = useLocation();

    const [page, setPage] = useState("");
    const [email, setEmail] = useState("");

    // Update page 
    useEffect(() => {
        if (location?.pathname?.includes("password-reset-link")) setPage("password-reset-link");
        else setPage("email-updation-link");
    }, [location]);

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return toast.error("Email is required.");
        setScreenLoader(true);

        try {
            let endpoint = page === "password-reset-link" ? "send-password-reset-link" : "send-email-updation-link";

            await interceptor.post(`/api/account/${endpoint}`, { email: email.trim() });
            toast.success(
                <div>
                    <strong>Link has been sent to your email.</strong>
                    <p style={{ fontSize: "0.9em" }}>Click the link to proceed with your request.</p>
                </div>
            )
            setEmail("");

        } catch (error) {
            console.log("Error sending link:", error);
            toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setScreenLoader(false);
        }
    };

    
    return (
        <main className={`min-h-screen flex items-center justify-center ${bgColor} px-4`}>
            <div className={`max-w-xl w-full ${modalsBg} rounded-3xl shadow-md ${shadow} border ${border} p-8`}>
                <h2 className="text-2xl font-bold mb-2">
                    {page === "password-reset-link" ? "Forgot Your Password?" : "Change Your Email Address"}
                </h2>
                <p className={`text-sm mb-6 ${grayText}`}>We’ll send a verification link to your email address.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className={`block text-sm font-medium ${grayText} mb-2`}>Your Email</label>
                    <input
                        id="email"
                        type="email"
                        className={`mb-4 block w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 ${border}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                    />

                    <button type="submit" className={`w-full py-2 px-4 text-white rounded-xl ${buttonStyle} transition duration-200 cursor-pointer`}>
                        Send Link
                    </button>
                </form>

                <p className="mt-4 text-sm">Already have a link?</p>
                <p className={`text-sm ${grayText}`}>Open your mail provider &gt; find the mail &gt; click the given link.</p>
            </div>
        </main>
    );
}
