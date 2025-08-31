import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import interceptor from "../middleware/axiosInterceptor";
import Sidebar from "../components/Sidebar";
import useThemeStyles from "../hooks/useThemeStyles";

export default function FollowList({ type }) {
    const navigate = useNavigate();
    const { bgColor, border, grayText } = useThemeStyles();

    const { userId } = useParams();
    const [users, setUsers] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const observerRef = useRef();

    // Fetch data
    const fetchData = async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const res = await interceptor.get(`/api/follow/${userId}/${type}`, {
                params: { limit: 20, cursor }
            });

            setUsers(prev => [...prev, ...res.data[type]]);
            setCursor(res.data.nextCursor || null);
            setHasMore(!!res.data.nextCursor);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setUsers([]);
        setCursor(null);
        setHasMore(true);
        fetchData();
    }, [userId, type]);

    // Setup intersection observer
    const lastUserRef = useCallback(node => {
        if (loading) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchData();
            }
        });
        if (node) observerRef.current.observe(node);
    }, [loading, hasMore, cursor]);

    // Navigations
    const handleNavigation = (type) => {
        navigate(`/profile/${userId}/${type}`, { replace: true });
    }

    return (
        <main className="w-screen min-h-dvh flex">
            <Sidebar />

            <section className={`overflow-y-auto w-full ${bgColor} p-4`}>
                <div className={`flex justify-center items-center gap-12 border-b ${border} pb-4`}>
                    <button type="button" onClick={() => handleNavigation("followers")} className={`${type === "followers" ? "" : grayText}`}>Followers</button>
                    <button type="button" onClick={() => handleNavigation("following")} className={`${type === "following" ? "" : grayText}`}>Following</button>
                </div>

                {/* User cards */}
                {users.map((u, idx) => {
                    if (idx === users.length - 1) {
                        // Attach ref to the last user
                        return (
                            <div ref={lastUserRef} key={u._id} onClick={() => navigate(`/profile/${u._id}`)} className={`flex items-center gap-3 p-2 border-b ${border}`}>
                                <img src={u.avatar || "/user.png"} alt="" className="w-8 h-8 rounded-full object-center object-cover" />
                                <div>
                                    <p className="leading-4">{u.username || "yovo_user"}</p>
                                    <p className={`text-sm ${grayText}`}>{u.profile_name || ""}</p>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={u._id} onClick={() => navigate(`/profile/${u._id}`)} className={`flex items-center gap-3 p-2 border-b ${border}`}>
                                <img src={u.avatar || "/user.png"} alt="" className="w-8 h-8 rounded-full object-center object-cover" />
                                <div>
                                    <p className="leading-4">{u.username || "yovo_user"}</p>
                                    <p className={`text-sm ${grayText}`}>{u.profile_name || ""}</p>
                                </div>
                            </div>
                        );
                    }
                })}

                {loading && <p className="text-center mt-2">Loading...</p>}
                {!hasMore && <p className="text-center mt-2 text-gray-500">No more {type}</p>}
            </section>
        </main>
    );
}
