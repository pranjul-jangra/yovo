import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe, FaClock, FaDesktop } from 'react-icons/fa';
import useThemeStyles from '../hooks/useThemeStyles';
import useAuthStore from '../store/authStore';
import { toast } from 'sonner';
import useLoaderStore from '../store/loaderStore';
import interceptor from '../middleware/axiosInterceptor';



export default function SessionsHistory() {
    const { bgColor, modalsBg, border, grayText, shadow } = useThemeStyles();
    const { user, setUser } = useAuthStore();
    const { setScreenLoader } = useLoaderStore();
    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        (async () => {
            // Fetch user and update state if user is not available
            if (!user || !user.username || !user.email) {
                setScreenLoader(true);
                try {
                    const res = await interceptor.get(`/api/profile/me`);
                    setUser(res.data?.user);
                    setSessions(res.data?.user?.sessions || []);

                } catch (error) {
                    console.log("Error getting user in session history comp:", error);
                    toast.error(error.response?.data?.error || 'An error occurred. Please try again.')
                } finally {
                    setScreenLoader(false);
                }
            } else {
                // Update state directly when the user is available
                setSessions(user?.sessions || []);
            }
        })()
    }, [user]);


    return (
        <main className={`${bgColor} px-4 py-10 w-screen min-h-dvh`}>
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-center">Login Sessions</h1>
                    <p className={`${grayText} mt-1 text-center`}>
                        Manage where you're currently logged in. You can log out from individual devices or all at once.
                    </p>

                    <div className={`${grayText} text-sm mt-5`}>
                        <strong>{sessions?.length ?? 0}</strong> active session{sessions?.length !== 1 ? 's' : ''} detected
                    </div>
                </div>


                {/* Sessions */}
                {sessions?.length === 0
                    ?
                    <p className={`${grayText}`}>No active sessions found.</p>
                    :
                    <div className="space-y-4">
                        {sessions?.map((session, i) => (
                            <div
                                key={`session-${i}`}
                                className={`border ${border} ${modalsBg} shadow-sm ${shadow} rounded-xl p-4 flex flex-col justify-between items-start`}
                            >
                                <div className="text-sm flex items-center gap-2">
                                    <FaDesktop className="text-gray-400" />
                                    {/* Device or Browser used for login */}
                                    <span>
                                        {(() => {
                                            const device = session.device?.vendor;
                                            const browser = session.device?.browser;
                                            const os = session.device?.os || '?';

                                            const isUnknown = (value) => !value || /unknown|undefined|null/i.test(value);

                                            const showDevice = !isUnknown(device);
                                            const showBrowser = !isUnknown(browser);

                                            if (showDevice && showBrowser) {
                                                return `${device} – ${browser} – ${os}`;
                                            } else if (showDevice) {
                                                return `${device} – ${os}`;
                                            } else if (showBrowser) {
                                                return `${browser} – ${os}`;
                                            } else {
                                                return `Unknown Device – ${os}`;
                                            }
                                        })()}
                                    </span>
                                </div>
                                <div className={`text-sm ${grayText} mt-1 flex items-center gap-2`}>
                                    <FaGlobe className="text-gray-400" />
                                    <span>
                                        {session.location.city || ''}, {session.location.region || ''},{' '}
                                        {session.location.country || ''} ({session.location.ip})
                                    </span>
                                </div>
                                <div className={`text-xs ${grayText} mt-1 flex items-center gap-2`}>
                                    <FaClock className="text-gray-400" />
                                    <span>
                                        Logged in on{' '}
                                        {new Date(session.createdAt).toLocaleString(undefined, {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                }


                {/* Clear all other sessions */}
                {sessions?.length > 1 && (
                    <div className={`pt-6 border-t ${border}`}>
                        <button
                            type='button'
                            aria-label='logout of ll other sessions'
                            onClick={() => navigate('/settings/logout-other-sessions')}
                            className="text-red-600 hover:underline text-sm font-medium"
                        >
                            Log out of all other sessions
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
