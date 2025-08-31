import { useState } from "react";
import useThemeStyles from "../hooks/useThemeStyles";
import { toast } from "sonner";
import interceptor from "../middleware/axiosInterceptor";
import useLoaderStore from "../store/loaderStore";

export default function ChangePassword() {
    const { modalsBg, bgColor, grayText, shadow, border, buttonStyle } = useThemeStyles();
    const { setScreenLoader } = useLoaderStore();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState('');

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;

    // Validate password strength
    function validatePassword(value) {
        if (!value) {
            setPasswordError('');
        } else if (!passwordRegex.test(value)) {
            setPasswordError('Password must be 8+ chars, include 1 uppercase and 1 special character.');
        } else {
            setPasswordError('');
        }
    }

    // Password change handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(passwordError) return toast.error("Please validate your password.");
        if (!currentPassword || !newPassword) return toast.error("Both fields are required.");
        if (currentPassword === newPassword) return toast.error("You can't use same values in both fields.");
        setScreenLoader(true);

        try {
            await interceptor.post('/api/account/change-password', { password: currentPassword, newPassword });
            setCurrentPassword("");
            setNewPassword("");
            toast.success("Password updated successfully.")

        } catch (error) {
            console.log("Error changing password:", error);
            toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setScreenLoader(false);
        }
    };

    return (
        <main className={`min-h-screen flex items-center justify-center ${bgColor} px-4`}>
            <div className={`max-w-xl w-full ${modalsBg} rounded-3xl shadow-md ${shadow} border ${border} p-8`}>
                <h2 className="text-2xl font-bold mb-2">Change Your Password</h2>
                <p className={`text-sm mb-6 ${grayText}`}>Keep your account secure with a strong password.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="current-password" className={`text-sm font-medium ${grayText} mb-2`}>Current Password</label>
                    <input
                        id="current-password"
                        type="password"
                        className={`mb-4 block w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 ${border}`}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                    />

                    <label htmlFor="new-password" className={`text-sm font-medium ${grayText} mb-2`}>New Password</label>
                    <input
                        id="new-password"
                        type="password"
                        className={`mb-4 block w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 ${border}`}
                        value={newPassword}
                        onChange={(e) => {setNewPassword(e.target.value); validatePassword(e.target.value)}}
                        placeholder="Enter new password"
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
