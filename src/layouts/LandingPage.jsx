import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useThemeStyles from '../hooks/useThemeStyles';
import useAuthStore from '../store/authStore';
import interceptor from '../middleware/axiosInterceptor';
import LandingPageLoader from '../components/LandingPageLoader';

export default function LandingPage() {
    const navigate = useNavigate();
    const { bgColor } = useThemeStyles();
    const { setUser } = useAuthStore();

    useEffect(() => {
        (async () => {
            try{
                const res = await interceptor.get(`/api/profile/me`);
                const data = res.data?.user;
                
                if(!data || data === 'undefined' || Object.keys(data) === 0) return navigate('/signup', { replace: true });
                setUser(data);
                navigate('/home', { replace: true });

            }catch(error){
                navigate('/signup', { replace: true });
            }
        })();
    }, []);


    return <main className={`w-screen h-dvh overflow-hidden ${bgColor}`}>
        <LandingPageLoader />
    </main>
}
