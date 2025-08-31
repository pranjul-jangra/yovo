import { useEffect } from "react"
import { FaLock, FaGlobe } from "react-icons/fa"
import { Switch } from "../ui/Switch"
import useThemeStyles from "../hooks/useThemeStyles"
import useAuthStore from "../store/authStore";
import interceptor from "../middleware/axiosInterceptor";
import useLoaderStore from "../store/loaderStore";
import { toast } from "sonner";


export default function AccountPrivacy() {
    const { bgColor, modalsBg, grayText, border, shadow } = useThemeStyles();
    const { user, setUser } = useAuthStore();
    const { setScreenLoader } = useLoaderStore();

    // Fetch user if not available
    useEffect(() => {
        (async () => {
            if (!user.username && !user.email) {
                try {
                    setScreenLoader(true);
                    const res = await interceptor.get(`/api/profile/me`);
                    setUser(res.data?.user);

                } catch (error) {
                    console.log("Error getting user in account privacy comp:", error);
                } finally {
                    setScreenLoader(false);
                }
            }
        })()
    }, [user]);

    // Toggle account mode
    const handleToggle = async () => {
        setScreenLoader(true);
        try {
            await interceptor.post('/api/account/switch-account', { toggledValue: !user?.is_account_private });
            setUser({ ...user, is_account_private: !user?.is_account_private });
            toast.success("Account mode updated.");

        } catch (error) {
            console.log("Error switching account mode:", error);
            toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setScreenLoader(false);
        }
    }

    return (
        <main className={`${bgColor} w-screen h-dvh flex justify-center items-center`}>
            <section className={`p-8 max-w-xl w-full ${modalsBg} rounded-xl shadow-md space-y-4 border ${border} shadow-md ${shadow}`}>
                <div className="flex items-center gap-3">
                    {user?.is_account_private
                        ? <FaLock className="text-blue-600" />
                        : <FaGlobe className="text-green-600" />
                    }
                    <h2 className="text-lg font-semibold">
                        Account Privacy
                    </h2>
                </div>

                <p className={`text-sm text-muted-foreground ${grayText}`}>
                    Your account is currently <span className="font-medium">{user?.is_account_private ? "Private" : "Public"}</span>.
                    {user?.is_account_private
                        ? " Only your followers can see your posts and profile."
                        : " Everyone can view your posts and profile."}
                </p>

                <div className={`flex items-center justify-between`}>
                    <span className="text-sm font-medium">Private Mode</span>
                    <Switch checked={user?.is_account_private} onCheckedChange={handleToggle} />
                </div>
            </section>
        </main>
    )
}
