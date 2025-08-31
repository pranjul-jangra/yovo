import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useThemeStyles from "../hooks/useThemeStyles";
import { toast } from "sonner";
import useLoaderStore from "../store/loaderStore";
import interceptor from "../middleware/axiosInterceptor";

export default function ResetPassword() {
    const { modalsBg, bgColor, grayText, shadow, border, buttonStyle } = useThemeStyles();
    const { setScreenLoader } = useLoaderStore();

    // Validate password strength
    const [passwordError, setPasswordError] = useState('');
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;

    function validatePassword(value) {
        if (!value) {
            setPasswordError('');
        } else if (!passwordRegex.test(value)) {
            setPasswordError('Password must be 8+ chars, include 1 uppercase and 1 special character.');
        } else {
            setPasswordError('');
        }
    }

    // Extracting token
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(passwordError) return toast.error("Please validate your password.");
        if (!newPassword.trim() || !confirmPassword.trim()) return toast.error("Both fields are required.");
        if (newPassword !== confirmPassword) return toast.error("Passwords did not match.");
        setScreenLoader(true);

        try {
            await interceptor.post('/api/account/reset-password', { token, newPassword: newPassword.trim() });

            toast.success("Password updated successfully.");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.log("Error reseting password:", error);
            toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setScreenLoader(false);
        }
    };

    return (
        <main className={`min-h-screen flex items-center justify-center ${bgColor} px-4`}>
            <div className={`max-w-xl w-full ${modalsBg} rounded-3xl shadow-md ${shadow} border ${border} p-8`}>
                <h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
                <p className={`text-sm mb-6 ${grayText}`}>Enter your new password below.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="new-password" className={`block text-sm font-medium ${grayText} mb-2`}>New Password</label>
                    <input
                        id="new-password"
                        type="password"
                        className={`mb-4 block w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${border}`}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Create a new password"
                    />

                    <label htmlFor="confirm-password" className={`block text-sm font-medium ${grayText} mb-2`}>Confirm Password</label>
                    <input
                        id="confirm-password"
                        type="password"
                        className={`mb-4 block w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${border}`}
                        value={confirmPassword}
                        onChange={(e) => {setConfirmPassword(e.target.value); validatePassword(e.target.value)}}
                        placeholder="Re-enter new password"
                    />

                    {passwordError && <small className="text-red-600 font-semibold">{passwordError}</small>}

                    <button type="submit" className={`w-full py-2 px-4 text-white rounded-xl ${buttonStyle} transition duration-200 cursor-pointer`}>
                        Update Password
                    </button>
                </form>
            </div>
        </main>
    );
}
