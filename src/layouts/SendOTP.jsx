import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useThemeStyles from "../hooks/useThemeStyles";
import useLoaderStore from "../store/loaderStore";
import { toast } from "sonner";
import interceptor from "../middleware/axiosInterceptor";

export default function SendOTP() {
    const { modalsBg, bgColor, grayText, shadow, border, buttonStyle, blueText } = useThemeStyles();
    const { setScreenLoader } = useLoaderStore();

    const [email, setEmail] = useState("");

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Email is required.");
        setScreenLoader(true);

        try {
            await interceptor.post(`/api/account/send-account-deletion-otp`, { email });
            toast.success(
                <div>
                    <strong>OTP has been sent to your email.</strong>
                    <p>Click the link below and enter the OTP to proceed.</p>
                    <Link to={'/settings/delete-account'} className={`${blueText} underline`}>Verify OTP</Link>
                </div>,
                {
                    duration: 8000
                }
            )
            setEmail("");

        } catch (error) {
            console.log("Error sending OTP:", error);
            toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setScreenLoader(false);
        }
    };

    return (
        <main className={`min-h-screen flex items-center justify-center ${bgColor} px-4`}>
            <div className={`max-w-xl w-full ${modalsBg} rounded-3xl shadow-md ${shadow} border ${border} p-8`}>
                <h2 className="text-2xl font-bold mb-2">Delete Your Account</h2>
                <p className={`text-sm mb-6 ${grayText}`}>We’ll send an OTP to your email to confirm.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className={`block text-sm font-medium ${grayText} mb-2`}>Your Email</label>
                    <input
                        id="email"
                        type="email"
                        className={`mb-4 block w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${border}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                    />

                    <button type="submit" className={`w-full py-2 px-4 text-white rounded-xl ${buttonStyle} transition duration-200 cursor-pointer`}>
                        Send OTP
                    </button>
                </form>

                <p className="mt-4 text-sm">Already have an OTP?</p>
                <p className={`text-sm ${grayText}`}>Verify your OTP <Link to={'/settings/delete-account'} className={`${blueText} underline`}>here</Link> to proceed with your request.</p>
            </div>
        </main>
    );
}
