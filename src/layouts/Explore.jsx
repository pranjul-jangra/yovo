import { useState, useEffect } from 'react';
import useThemeStyles from '../hooks/useThemeStyles';
// import TagFilter from '../components/TagFilter';
import TrendingSection from '../components/TrendingSection';
import UserCard from '../ui/UserCard';
import SearchBar from '../components/SearchBar';
import Sidebar from '../components/Sidebar';
import interceptor from '../middleware/axiosInterceptor';
import { FaUserAlt, FaMountain } from "react-icons/fa";

export default function ExplorePage() {
    const [tags, setTags] = useState([]);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedTag, setSelectedTag] = useState("All");

    const [postCursor, setPostCursor] = useState(null);
    const [userCursor, setUserCursor] = useState(null);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);
    const [loading, setLoading] = useState(true);

    const { bgColor, grayText } = useThemeStyles();

    // Load initial Explore data
    useEffect(() => {
        const fetchExplore = async () => {
            setLoading(true);
            try {
                const { data } = await interceptor.get("/api/explore", {
                    params: { limitPosts: 9, limitUsers: 10, limitTags: 8 }
                });

                setTags(data.tags || []);
                setUsers(data.users || []);
                setPosts(data.posts || []);
                setPostCursor(data.nextPostCursor || null);
                setUserCursor(data.nextUserCursor || null);
                setHasMorePosts(!!data.nextPostCursor);
                setHasMoreUsers(!!data.nextUserCursor);
            } catch (err) {
                console.error("Failed to load explore data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExplore();
    }, []);

    // Load more posts when scrolling down
    const fetchMorePosts = async () => {
        if (!hasMorePosts) return;
        try {
            const { data } = await interceptor.get("/api/explore/posts", {
                params: { cursor: postCursor, limit: 9 }
            });

            setPosts(prev => [...prev, ...data.posts]);
            setPostCursor(data.nextCursor || null);
            setHasMorePosts(!!data.nextCursor);
        } catch (err) {
            console.error("Failed to load more posts", err);
        }
    };

    // Load more users when horizontal scroll
    const fetchMoreUsers = async () => {
        if (!hasMoreUsers) return;
        try {
            const { data } = await interceptor.get("/api/explore/users", {
                params: { cursor: userCursor, limit: 10 }
            });

            setUsers(prev => [...prev, ...data.users]);
            setUserCursor(data.nextCursor || null);
            setHasMoreUsers(!!data.nextCursor);
        } catch (err) {
            console.error("Failed to load more users", err);
        }
    };

    // When tag clicked → fetch posts for that tag
    // useEffect(() => {
    //     if (selectedTag === "All") return;

    //     const fetchTagPosts = async () => {
    //         try {
    //             const { data } = await interceptor.get(`/api/explore/tag/${selectedTag}`, {
    //                 params: { limit: 9 }
    //             });

    //             setPosts(data.posts || []);
    //             setPostCursor(data.nextCursor || null);
    //             setHasMorePosts(!!data.nextCursor);
    //         } catch (err) {
    //             console.error(`Failed to fetch posts for tag ${selectedTag}`, err);
    //         }
    //     };

    //     fetchTagPosts();
    // }, [selectedTag]);

    return (
        <main className="flex w-screen min-h-dvh">
            <Sidebar />

            {/* Explore page */}
            <div className={`min-h-dvh ${bgColor} p-4 w-full overflow-hidden`}>
                <h1 className="text-2xl font-bold mb-6">Explore</h1>

                <SearchBar />

                {/* <TagFilter tags={tags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} /> */}

                {/* Users */}
                {users?.length !== 0 && <h2 className="text-xl font-semibold mt-8 mb-3 flex items-center gap-3">
                    <FaUserAlt className="text-purple-800" /> Popular Users
                </h2>}
                
                <div
                    className="flex gap-4 max-md:gap-1 overflow-x-auto pb-4 w-full"
                    onScroll={e => {
                        if (e.target.scrollLeft + e.target.clientWidth >= e.target.scrollWidth - 20) {
                            fetchMoreUsers();
                        }
                    }}
                >
                    {users.map(user => (
                        <div key={user?._id}>
                            <UserCard user={user} />
                        </div>
                    ))}
                </div>

                {/* Posts */}
                {posts?.length !== 0 && <h2 className="text-xl font-semibold mt-6 mb-3 flex items-center gap-3">
                    <FaMountain className="text-yellow-600" /> Trending Posts
                </h2>}
                <TrendingSection posts={posts} setPosts={setPosts} fetchMorePosts={fetchMorePosts} hasMore={hasMorePosts} />


                {/* Loader */}
                {loading && <div className={`w-6 h-6 mx-auto mt-4 border-2 rounded-full animate-spin ${grayText}`}></div>}

                {/* Empty feed indicator */}
                {users?.length === 0 && posts?.length === 0 && !loading && (
                    <div className={`text-center text-sm mt-10 ${grayText}`}>Feed is empty.</div>
                )}
            </div>
        </main>
    );
}
