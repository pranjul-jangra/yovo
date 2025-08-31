import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useThemeStyles from "../hooks/useThemeStyles";
import { toast } from "sonner";
import useLoaderStore from "../store/loaderStore";
import interceptor from "../middleware/axiosInterceptor";
import useAuthStore from "../store/authStore";

export default function LogoutAll() {
    const { modalsBg, bgColor, grayText, shadow, border, buttonStyle } = useThemeStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const { setScreenLoader } = useLoaderStore();
    const { resetAuth, setUser, user } = useAuthStore();

    const allLogout = location.pathname.includes("logout-all");

    const [password, setPassword] = useState("");

    // Logout handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password) return toast.error("Password is required.");
        setScreenLoader(true);

        try {
            // Update sessions based on the endpoint
            if(allLogout){
                await interceptor.post(`/api/auth/logout-all`, { password });
            }else{
                const res = await interceptor.post(`/api/auth/logout-other-sessions`, { password });
                setUser({ ...user, sessions: [res.data?.currentSession] })
            }

            setPassword("");

            // Navigations after logout
            if(allLogout){
                resetAuth();
                navigate('/signup', { replace: true });
            }else{
                navigate(-1, { replace: true });
            }

        } catch (error) {
            console.log("Error logging out all sessions:", error);
            const serverMessage = error?.response?.data?.error;

            if (serverMessage === "Incorrect password") {
                toast.error("Incorrect password.");
            } else if (serverMessage === "Password is required") {
                toast.error("Password is required.");
            } else {
                toast.error("Something went wrong. Please try again later.");
            }
        } finally {
            setScreenLoader(false);
        }
    };


    return (
        <main className={`min-h-screen flex items-center justify-center ${bgColor} px-4`}>
            <div className={`max-w-xl w-full ${modalsBg} rounded-3xl shadow-md ${shadow} border ${border} p-8`}>
                <h2 className="text-2xl font-bold mb-2">
                    {allLogout
                        ? "Logout of All Devices"
                        : "Logout of All Other Devices"}
                </h2>
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
                        Logout
                    </button>
                </form>
            </div>
        </main>
    );
}
