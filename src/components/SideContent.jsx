import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaComment } from "react-icons/fa6";
import { AiOutlineSmallDash } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { PiNotificationBold } from "react-icons/pi";
import useThemeStyles from "../hooks/useThemeStyles";
import interceptor from '../middleware/axiosInterceptor.js';
import { IoMdAdd } from "react-icons/io";


export default function SideContent() {
    const { border, navBg, blueText, grayText } = useThemeStyles();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch activities
    const fetchActivities = async () => {
        setLoading(true);
        try {
            const res = await interceptor.get("/api/activity", {
                params: { page: 1, limit: 10, type: "all" }
            });
            setActivities(res.data.activities || []);
        } catch (err) {
            console.error("Error fetching activities:", err);
        }finally{
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchActivities();
    }, []);

    // Pick icon based on type
    function getIcon(type) {
        switch (type) {
            case "like_post":
                return <FcLike className="w-7 aspect-square shrink-0" />;
            case "comment_post":
                return <FaComment className="w-7 aspect-square shrink-0" />;
            case "post_created":
                return <IoMdAdd className="w-7 aspect-square shrink-0" />;
            case "follow_user":
                return <PiNotificationBold className="w-7 aspect-square shrink-0 text-blue-500" />;
            case "unfollow_user":
                return <PiNotificationBold className="w-7 aspect-square shrink-0 text-gray-400" />;
            default:
                return <PiNotificationBold className="w-7 aspect-square shrink-0" />;
        }
    }

    // Build readable message
    function getMessage(activity) {
        const actorName = activity.actor?.username || "Someone";
        switch (activity.type) {
            case "like_post":
                return `${actorName} liked your post`;
            case "comment_post":
                return `${actorName} commented: "${activity.targetComment?.text || "..."}"`;
            case "post_created":
                return `${actorName} created a new post`;
            case "follow_user":
                return `${actorName} started following you`;
            case "unfollow_user":
                return `${actorName} unfollowed you`;
            default:
                return activity.message || "New activity";
        }
    }

    return (
        <section className={`w-full max-w-56 lg:max-w-72 min-w-56 h-dvh sticky top-0 px-4 border-l-1 ${border} py-4`}>
            {/* Nav items */}
            <Link
                to={'/home/create'}
                aria-label="Create post"
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-full ${navBg} cursor-pointer text-sm`}
            >
                <IoMdAdd className="text-xl" /> <span className='pb-0.5'>Create new post</span>
            </Link>

            {/* Header */}
            <div className="flex items-center justify-between mt-8">
                <h2 className="font-semibold tracking-wide">Last Activity</h2>
                {activities?.length > 0 && <Link to={'/home/activities'} className={`${blueText} text-sm cursor-pointer`}>See all</Link>}
            </div>

            {/* No activities */}
            {activities?.length === 0 && !loading && (
                <p className={`${grayText} text-sm text-center mt-8`}>No activity yet.</p>
            )}

            {/* Activities */}
            {activities?.slice(0, 8)?.map((activity, i) => (
                <div key={`activity-${i}`} className="flex items-center gap-1.5 mt-2">
                    {getIcon(activity.type)}
                    <p className={`text-sm ${grayText} whitespace-nowrap truncate pb-[0.3rem]`}>
                        {getMessage(activity)}
                    </p>
                </div>
            ))}

            {/* Loader */}
            {
                loading && <div className={`w-5 h-5 mx-auto mt-5 border-2 border-dotted rounded-full ${grayText} animate-spin`}></div>
            }

            {/* Has more indicator */}
            {activities?.length > 8 && !loading && (
                <p className={`pl-1 text-3xl ${grayText}`}><AiOutlineSmallDash /></p>
            )}
        </section>
    );
}
