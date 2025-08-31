import { Link, useNavigate } from 'react-router-dom';
import { settingsLinks } from '../utils/settingsLinks';
import useThemeStyles from '../hooks/useThemeStyles';
import { FaArrowCircleRight } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { toast } from 'sonner';
import interceptor from '../middleware/axiosInterceptor';
import useAuthStore from '../store/authStore';
import useLoaderStore from '../store/loaderStore';


export default function Settings() {
    const { bgColor, modalsBg, border, grayText, shadow } = useThemeStyles();
    const navigate = useNavigate();
    const { resetAuth } = useAuthStore();
    const { setScreenLoader } = useLoaderStore();

    async function handleLogout() {
        setScreenLoader(true);
        try{
            await interceptor.post('/api/auth/logout');
            resetAuth();
            navigate('/signup', { replace: true });

        }catch(error){
            toast.error("Failed to log out. Please try again later.");
        }finally{
            setScreenLoader(false);
        }
    }


    return (
        <main className='flex w-screen min-h-dvh'>
            <Sidebar />
            <div className={`${bgColor} px-4 py-10 w-screen min-h-dvh transition`}>
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Settings</h1>

                    {/* Categories */}
                    {settingsLinks.map((section) => (
                        <div key={section.category} className="mb-8">
                            <h2 className={`text-xl font-semibold ${grayText} mb-4`}>{section.category}</h2>

                            {/* Items */}
                            <div className="space-y-4">
                                {section.items.map(({ to, icon, title, description }) => {
                                    if (to === '/settings/logout') {
                                        return <button
                                            key={to}
                                            onClick={handleLogout}
                                            className={`flex items-center gap-4 w-full text-left ${modalsBg} border ${border} rounded-xl p-4 shadow-sm ${shadow} transition`}
                                        >
                                            <div className="text-2xl mt-1">{icon}</div>
                                            <div>
                                                <h3 className="text-lg font-medium">{title}</h3>
                                                <p className={`text-sm ${grayText}`}>{description}</p>
                                            </div>
                                            <div className='ml-auto text-gray-400'><FaArrowCircleRight /></div>
                                        </button>
                                    } else {
                                        return <Link to={to} key={to} className={`flex items-center gap-4 ${modalsBg} border ${border} rounded-xl p-4 shadow-sm ${shadow} transition`}>
                                            <div className="text-2xl mt-1">{icon}</div>
                                            <div>
                                                <h3 className="text-lg font-medium">{title}</h3>
                                                <p className={`text-sm ${grayText}`}>{description}</p>
                                            </div>
                                            <div className='ml-auto text-gray-400'><FaArrowCircleRight /></div>
                                        </Link>
                                    }
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
