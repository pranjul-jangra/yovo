import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from 'motion/react';
import ProfileInfo from "../components/ProfileInfo";
import ProfilePosts from "../components/ProfilePosts";
import Sidebar from "../components/Sidebar";
import useThemeStyles from "../hooks/useThemeStyles";
import { Link } from 'react-router-dom';
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";
import { RiBallPenLine } from "react-icons/ri";
import interceptor from "../middleware/axiosInterceptor";
import useAuthStore from "../store/authStore";
import { IoMdAdd } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";


export default function Profile() {
  const navigate = useNavigate();
  const { bgColor, border, modalsBg, hoverBg } = useThemeStyles();
  const { user, setUser, otherUser, setOtherUser } = useAuthStore();
  const { userId } = useParams();

  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef();

  // Close context menu on window click or scroll
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleClickOutside);
    }
  }, []);

  // Condition to fetch user data
  const shouldFetch = !user || Object.keys(user)?.length === 0 || !user?.username || !user?.email || !user?._id;

  // Fetch user data 
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await interceptor.get(`/api/profile/${userId}`);
      userId === "me" ? setUser(res.data?.user) : setOtherUser(res.data?.user);

    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if ((userId === "me" && shouldFetch) || userId !== "me") fetchProfile();
  }, [userId]);

  // Report user
  const handleReport = () => {
    const targetId = userId === "me" ? user?._id : otherUser?._id;
    navigate('/report', { state: { reportType: "user", targetId } })
  };


  return (
    <main className="w-screen min-h-dvh flex">
      <Sidebar />

      {/* Profile content */}
      {loading
        ? <ProfileSkeleton />
        : <section className={`overflow-y-auto w-full ${bgColor} p-4`}>
          <div>
            {/* username + actions */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold tracking-wide">{userId === "me" ? user?.username : otherUser?.username}</h2>

              <div className="flex gap-4 items-center">
                {(userId === "me" || user?._id === otherUser?._id) && <Link to='/profile/me/edit-profile' className={`border ${border} px-2 py-2 rounded-full cursor-pointer transition-colors duration-200`}><RiBallPenLine /></Link>}
                {(userId === "me" || user?._id === otherUser?._id) && <Link to={'/home/create'} aria-label="Create post" className={`border ${border} px-2 py-2 rounded-full cursor-pointer transition-colors duration-200`}><IoMdAdd /></Link>}

                {(userId !== "me" && user?._id !== otherUser?._id) && <div className="relative" ref={menuRef}>
                  <IoEllipsisVertical className="cursor-pointer" onClick={() => setShowMenu(prev => !prev)} />

                  <AnimatePresence>
                    {
                      showMenu && <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute min-w-44 top-6 right-0 z-50 shadow-md rounded-lg ${modalsBg} border ${border} text-sm`}
                      >
                        <ul className="min-w-[120px] py-2">
                          <li className={`px-4 py-1.5 ${hoverBg} cursor-pointer`} onClick={handleReport}>Report this user</li>
                        </ul>
                      </motion.div>
                    }
                  </AnimatePresence>
                </div>}
              </div>
            </div>

            {/* profile info + posts */}
            <ProfileInfo />
            <ProfilePosts userId={userId} />
          </div>
        </section>}
    </main>
  )
}
