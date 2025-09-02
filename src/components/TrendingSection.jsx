import { useEffect, useRef, useState } from 'react';
import { FaVideo } from 'react-icons/fa';
import './components.css';
import useAuthStore from '../store/authStore';
import PostCard from './PostCard';
import useThemeStyles from '../hooks/useThemeStyles';

export default function TrendingSection({ posts = [], setPosts, fetchMorePosts, hasMore = false }) {
    const sentinelRef = useRef(null);
    const { user } = useAuthStore();
    const { border } = useThemeStyles();

    const [postData, setPostData] = useState(null);

    // Lock body when modal open
    useEffect(() => {
        postData
            ? document.body.style.overflow = "hidden"
            : document.body.style.overflow = "auto";
    }, [postData]);

    // Infinite scroll
    useEffect(() => {
        if (!fetchMorePosts || !hasMore) return;

        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) fetchMorePosts();
        },
            { rootMargin: '400px 0px' }
        );
        if (sentinelRef.current) obs.observe(sentinelRef.current);
        return () => obs.disconnect();
    }, [fetchMorePosts, hasMore]);


    return (
        <>
            <section className="grid grid-cols-3 gap-4 max-md:gap-1 md:grid-cols-4">
                {posts?.map(post => post?.video
                    ?
                    <div key={post?._id} className={`relative border ${border}`} onClick={() => setPostData(post)}>
                        <video src={post.video} mute className="w-full h-full shrink-0 rounded-xl object-cover cursor-pointer" />
                        <FaVideo className="absolute text-xl top-2 right-2 bg-black/60 text-white p-1 rounded-md" />
                    </div>
                    :
                    <img key={post?._id} onClick={() => setPostData(post)} src={post?.images?.[0]} alt="" className={`w-full h-full shrink-0 rounded-xl object-cover cursor-pointer border ${border}`} />
                )}

                {/* Invisible sentinel for pagination (no UI change) */}
                {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
            </section>

            {postData && (
                <div
                    className="fixed w-screen h-dvh inset-0 flex justify-center items-center bg-black/10 z-[1001]"
                    data-lenis-prevent
                    onClick={() => setPostData(null)}
                >
                    <PostCard p={postData} isModal={true} isOwner={user?._id === postData?.userId} setPosts={setPosts} />
                </div>
            )}
        </>
    );
}
