import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import useThemeStyles from "../hooks/useThemeStyles";
import useLoaderStore from "../store/loaderStore";
import interceptor from "../middleware/axiosInterceptor";
import useAuthStore from "../store/authStore";

export default function UpdateEmail() {
    const { modalsBg, bgColor, grayText, shadow, border, buttonStyle } = useThemeStyles();
    const { setScreenLoader } = useLoaderStore();
    const { setUser, user } = useAuthStore();

    // Extracting token
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    // State
    const [newEmail, setNewEmail] = useState("");

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newEmail.trim()) return toast.error("Enter your new email.");
        setScreenLoader(true);

        try{
            await interceptor.post('/api/account/update-email', { token, newEmail });
            toast.success("Email updated successfully.");
            setUser({ ...user, email: newEmail });
            setNewEmail("");

        }catch(error){
            console.log("Error updating email:", error);
            toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
        }finally{
            setScreenLoader(false);
        }
    };


    return (
        <main className={`min-h-screen flex items-center justify-center ${bgColor} px-4`}>
            <div className={`max-w-xl w-full ${modalsBg} rounded-3xl shadow-md ${shadow} border ${border} p-8`}>
                <h2 className="text-2xl font-bold mb-2">Update Your Email</h2>
                <p className={`text-sm mb-6 ${grayText}`}>Enter your new email below.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="new-email" className={`block text-sm font-medium ${grayText} mb-2`}>New Email</label>
                    <input
                        id="new-email"
                        type="email"
                        className={`mb-4 block w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 ${border}`}
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter new email"
                    />

                    <button type="submit" className={`w-full py-2 px-4 text-white rounded-xl ${buttonStyle} transition duration-200 cursor-pointer`}>
                        Update Email
                    </button>
                </form>
            </div>
        </main>
    );
}
