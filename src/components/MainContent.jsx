import useThemeStyles from '../hooks/useThemeStyles';
import { useState, useEffect, useRef, useCallback } from 'react';
// import Stories from './Stories'
import './components.css';
import PostCard from './PostCard';
import interceptor from '../middleware/axiosInterceptor';
import useAuthStore from '../store/authStore';


export default function MainContent() {
    const { user, setUser } = useAuthStore();
    const { grayText } = useThemeStyles();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [nextCursor, setNextCursor] = useState(null);

    const loaderRef = useRef(null);

    // Condition to fetch user data
    const shouldFetch = !user || Object.keys(user).length === 0 || !user.username || !user.email || !user._id;

    // Fetch user data 
    const fetchProfile = async () => {
        try {
            const res = await interceptor.get(`/api/profile/me`);
            setUser(res.data?.user)

        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };
    useEffect(() => {
        if (shouldFetch) fetchProfile();
    }, [user, shouldFetch]);

    // Fetch posts
    const fetchPosts = useCallback(async () => {
        if (loading || !hasNextPage) return;

        try {
            setLoading(true);
            const { data } = await interceptor.get('/api/posts/', {
                params: {
                    limit: 5,
                    cursor: nextCursor || undefined,
                },
            });

            setPosts(prev => [...prev, ...data.posts]);
            setNextCursor(data.nextCursor);
            setHasNextPage(data.hasNextPage);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    }, [loading, hasNextPage, nextCursor]);

    // Infinite scroll with IntersectionObserver
    useEffect(() => {
        if (!hasNextPage || loading) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchPosts();
            }
        },
            { threshold: 1 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [fetchPosts, hasNextPage, loading]);


    return (
        <section className='w-full overflow-x-hidden py-4 max-md:px-4'>
            {/* <Stories /> */}

            <h2 className="font-semibold tracking-wide">Timeline</h2>

            <div className='mt-8 flex flex-col items-center gap-8 max-md:gap-4 pb-8'>
                {/* Posts */}
                {posts?.map((p, i) => (
                    <PostCard key={`post-${i}`} p={p} setPosts={setPosts} isOwner={user?._id === p?.userId} />
                ))}

                {/* Loader trigger */}
                {hasNextPage && (
                    <div ref={loaderRef} className="py-6 text-sm flex justify-center items-center">
                        {
                            loading
                                ?
                                <div className={`w-5 h-5 mx-auto border-2 border-dotted rounded-full ${grayText} animate-spin`}></div>
                                :
                                "Scroll to load more"
                        }
                    </div>
                )}

                {/* No more posts */}
                {!hasNextPage && posts.length > 0 && (
                    <p className={`${grayText} py-6 text-sm text-center`}>
                        No more posts
                    </p>
                )}
            </div>
        </section>
    )
}
