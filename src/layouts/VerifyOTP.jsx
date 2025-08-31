import { useState } from "react";
import useThemeStyles from "../hooks/useThemeStyles";
import { useNavigate } from "react-router-dom";
import interceptor from "../middleware/axiosInterceptor";
import useAuthStore from "../store/authStore";
import useLoaderStore from "../store/loaderStore";

export default function VerifyOTP() {
    const { modalsBg, bgColor, grayText, shadow, border, buttonStyle } = useThemeStyles();
    const { resetAuth } = useAuthStore();
    const { screenLoader, setScreenLoader } = useLoaderStore();
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    // Delete account & navigate to signup page
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp) return setError("OTP is required.");
        if(otp.length !== 6) return setError("OTP must be of 6 digits.");
        setScreenLoader(true);

        try{
            await interceptor.post(`/api/account/delete-account`, { otp });
            resetAuth();
            navigate('/signup', { replace: true });

        }catch(error){
            console.log("Error deleting account:", error);
            setError(error.response.data.error || "Something went wrong.");
        }finally{
            setScreenLoader(false);
        }
    };

    return (
        <main className={`min-h-screen flex items-center justify-center ${bgColor} px-4`}>
            <div className={`max-w-xl w-full ${modalsBg} rounded-3xl shadow-md ${shadow} border ${border} p-8`}>
                <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
                <p className={`text-sm mb-6 ${grayText}`}>Enter the code we sent to your email.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="otp" className={`block text-sm font-medium ${grayText} mb-2`}>Your Email</label>
                    <input
                        id="otp"
                        type="number"
                        className={`mb-4 block w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${border}`}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.trim())}
                        placeholder="6-digit OTP code"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button type="submit" disabled={screenLoader} className={`w-full py-2 px-4 text-white rounded-xl ${buttonStyle} disabled:opacity-45 transition duration-200 cursor-pointer`}>
                        Verify & Delete Account
                    </button>
                </form>

                <p className="text-[0.8rem] text-red-500 mt-4 pl-1">This action is permanent and cannot be undone.</p>
            </div>
        </main>
    );
}
