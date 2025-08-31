import useThemeStyles from '../hooks/useThemeStyles';
import { useNavigate, useLocation } from 'react-router-dom';
import { LuMessageCircleMore } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import { IoSettingsOutline, IoBookmarksOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { RiHome2Line } from "react-icons/ri";


export default function Sidebar() {
    const { navBg, border } = useThemeStyles();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className={`w-16 max-md:w-screen h-dvh max-md:h-12 shrink-0 ${navBg} sticky md:top-0 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 flex flex-col max-md:flex-row justify-between items-center py-5 z-0 max-md:z-[1000] border-r-2 ${border}`}>
            <img src="/yovo.png" alt="Yovo" className='w-8 aspect-square object-cover cursor-pointer max-md:hidden' onClick={() => navigate('/home')} />

            <div className='*:cursor-pointer flex flex-col max-md:flex-row max-md:justify-between max-md:w-full max-md:px-4 gap-5 pl-1'>
                <RiHome2Line onClick={() => navigate('/home')} className={`text-xl ${location?.pathname?.includes("home") ? "" : "text-gray-600"}`}/>
                <MdOutlineExplore onClick={() => navigate('/explore')} className={`text-xl ${location?.pathname?.includes("explore") ? "" : "text-gray-600"}`}/>
                <LuMessageCircleMore onClick={() => navigate('/messages')} className={`text-lg ${location?.pathname?.includes("messages") ? "" : "text-gray-600"}`}/>
                <FaRegUser onClick={() => navigate('/profile/me')} className={`text-lg ${location?.pathname?.includes("/profile/") ? "" : "text-gray-600"}`}/>
                {/* <IoBookmarksOutline onClick={() => navigate('/saved')} className={`text-lg ${location?.pathname?.includes("saved") ? "" : "text-gray-600"}`}/> */}

                <hr className='border border-gray-600 text-lg max-md:hidden' />

                <IoSettingsOutline onClick={() => navigate("/settings")} className={`text-lg ${location?.pathname?.includes("settings") ? "" : "text-gray-600"}`}/>
            </div>
        </nav>
    )
}
