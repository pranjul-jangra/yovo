import { useState, useEffect, useRef, useCallback } from "react";
import { FaRegImages, FaVideo } from "react-icons/fa";
import { GrFormViewHide } from "react-icons/gr";
import interceptor from "../middleware/axiosInterceptor";
import PostCard from "./PostCard";
import useThemeStyles from "../hooks/useThemeStyles";
import useAuthStore from "../store/authStore.js";

export default function PostGrid({ userId = "me", type = "posts" }) {
    const loaderRef = useRef(null);
    const { grayText } = useThemeStyles();
    const { user } = useAuthStore();

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [postData, setPostData] = useState(null);

    // Lock body when modal open
    useEffect(() => {
        postData
            ? document.body.style.overflow = "hidden"
            : document.body.style.overflow = "auto";
    }, [postData]);

    // Fetch posts (or drafts)
    const fetchPosts = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const res = await interceptor.get(`/api/posts/${userId}?page=${page}&limit=10`);
            const { posts: newPosts, totalPages } = res.data;

            setPosts((prev) => [...prev, ...newPosts]);
            setHasMore(page < totalPages);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }, [page, userId, type, loading, hasMore]);

    useEffect(() => {
        fetchPosts();
    }, [page, type]);

    // Reset when type/userId changes
    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, [userId, type]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [hasMore, loading]);

    return (
        <>
            <section className="mt-8 grid grid-cols-3 gap-1 md:gap-3 max-md:pb-12 pb-4 max-w-4xl mx-auto">
                {posts?.length > 0 ? (
                    posts.map((post, i) => (
                        <div key={`post-${i}`} onClick={() => setPostData(post)} className="relative group h-44">
                            {post.video ?
                                <video src={post?.video} className="w-full h-full rounded-xl object-cover" muted />
                                :
                                <img src={post?.images?.[0]} alt="post" loading="lazy" className="w-full h-full rounded-xl object-cover object-center" />
                            }
                            {/* Media type indicator */}
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white p-1 rounded-md text-xs">
                                {post?.video ? <FaVideo /> : <FaRegImages />}
                            </div>
                            {/* Hidden post indicator */}
                            {post?.hide_post && <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white p-1 text-xs rounded-lg">
                                <GrFormViewHide /> Hidden
                            </span>}
                        </div>
                    ))
                ) : (
                    <p className={`col-span-3 text-sm text-center ${grayText}`}>
                        No {type}.
                    </p>
                )}

                {/* Laader */}
                {loading &&
                    <div ref={loaderRef} className="col-span-3 flex justify-center my-4">
                        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                }
            </section>

            {postData && (
                <div
                    className="fixed w-screen h-dvh inset-0 flex justify-center items-center bg-black/10 z-[1001]"
                    data-lenis-prevent
                    onClick={() => setPostData(null)}
                >
                    <PostCard p={postData} setPosts={setPosts} setPostData={setPostData} closeModal={() => setPostData(null)} isModal={true} isOwner={user?._id === postData?.userId} />
                </div>
            )}
        </>
    );
}
