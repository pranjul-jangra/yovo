import { useState, useEffect, useRef, useCallback } from "react";
import { FcLike } from "react-icons/fc";
import { FaComment } from "react-icons/fa6";
import { PiNotificationBold } from "react-icons/pi";
import useThemeStyles from "../hooks/useThemeStyles";
import interceptor from "../middleware/axiosInterceptor.js";
import { IoMdAdd } from "react-icons/io";

export default function ActivityPage() {
    const { grayText, border, bgColor } = useThemeStyles();

    const [activities, setActivities] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const loaderRef = useRef(null);

    // Fetch activities
    const fetchActivities = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const res = await interceptor.get("/api/activity", {
                params: { page, limit: 10, type: "all" }
            });
            const newActs = res.data.activities || [];
            setActivities(prev => [...prev, ...newActs]);
            setHasMore(page < res.data.totalPages);
        } catch (err) {
            console.error("Error fetching activities:", err);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading]);

    useEffect(() => {
        fetchActivities();
    }, [page]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prev => prev + 1);
            }
        });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [hasMore, loading]);

    // Pick icon
    function getIcon(type) {
        switch (type) {
            case "like_post": return <FcLike className="w-6 h-6 shrink-0" />;
            case "comment_post": return <FaComment className="w-6 h-6 shrink-0" />;
            case "post_created": return <IoMdAdd className="w-6 h-6 shrink-0" />;
            case "follow_user": return <PiNotificationBold className="w-6 h-6 shrink-0 text-blue-500" />;
            case "unfollow_user": return <PiNotificationBold className="w-6 h-6 shrink-0 text-gray-400" />;
            default: return <PiNotificationBold className="w-6 h-6 shrink-0" />;
        }
    }

    // Human-readable message
    function getMessage(activity) {
        const actorName = activity.actor?.username || "Someone";
        switch (activity.type) {
            case "like_post": return `${actorName} liked your post`;
            case "comment_post": return `${actorName} commented: "${activity.targetComment?.text || "..."}"`;
            case "post_created": return `${actorName} created a new post`;
            case "follow_user": return `${actorName} started following you`;
            case "unfollow_user": return `${actorName} unfollowed you`;
            default: return activity.message || "New activity";
        }
    }

    return (
        <main className={`w-screen min-h-dvh p-4 flex justify-center ${bgColor}`}>
            <section className={`w-full max-w-2xl p-4`}>
                <h1 className="text-xl font-semibold mb-4">All Activities</h1>

                {activities.map((activity, idx) => (
                    <div key={`activity-${idx}`} className={`flex items-center gap-3 p-2 border-b ${border}`}>
                        {getIcon(activity.type)}
                        <div>
                            <p className={`text-sm ${grayText}`}>{getMessage(activity)}</p>
                            <p className={`text-xs text-gray-400`}>{new Date(activity.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                ))}

                {loading && <p className="text-center mt-4">Loading...</p>}

                <div ref={loaderRef} className="h-10"></div>
                {!hasMore && <p className="text-center text-sm text-gray-400 mt-4">No more activities</p>}
            </section>
        </main>
    );
}
