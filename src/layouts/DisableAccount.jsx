import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useThemeStyles from "../hooks/useThemeStyles";
import { toast } from "sonner";
import useLoaderStore from "../store/loaderStore";
import interceptor from "../middleware/axiosInterceptor";
import useAuthStore from "../store/authStore";

export default function DisableAccount() {
    const { modalsBg, bgColor, grayText, shadow, border, buttonStyle } = useThemeStyles();
    const navigate = useNavigate();
    const { setScreenLoader } = useLoaderStore();
    const { resetAuth } = useAuthStore();

    const [password, setPassword] = useState("");

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) return toast.error("Password is required.");
        setScreenLoader(true);

        try {
            await interceptor.post(`/api/account/disable-account`, { password });
            setPassword("");
            resetAuth();
            navigate('/signup', { replace: true });

        } catch (error) {
            console.log("Error disabling account:", error);
            toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setScreenLoader(false);
        }
    };


    return (
        <main className={`min-h-screen flex items-center justify-center ${bgColor} px-4`}>
            <div className={`max-w-xl w-full ${modalsBg} rounded-3xl shadow-md ${shadow} border ${border} p-8`}>
                <h2 className="text-2xl font-bold mb-2">Disable Account</h2>
                <p className={`text-sm mb-6 ${grayText}`}>Enter your password for verification.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="password" className={`block text-sm font-medium ${grayText} mb-2`}>Your Password</label>
                    <input
                        id="password"
                        type="password"
                        className={`mb-4 block w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${border}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your current password"
                    />

                    <button type="submit" className={`w-full py-2 px-4 text-white rounded-xl ${buttonStyle} transition duration-200 cursor-pointer`}>
                        Disable my account
                    </button>
                </form>

                <p className="text-[0.8rem] text-green-500 mt-4 pl-1">You can come back anytime — all your data will be safe.</p>
            </div>
        </main>
    );
}
