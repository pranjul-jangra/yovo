import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";
import useThemeStyles from "../hooks/useThemeStyles";
import interceptor from "../middleware/axiosInterceptor";
import useAuthStore from "../store/authStore";


export default function PostPage() {
    const { bgColor } = useThemeStyles();
    const { postId } = useParams();
    const { user, setUser } = useAuthStore();

    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ error_code: null, error: "" });

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

    // Fetch post 
    async function fetchPost() {
        setLoading(true);
        setError({ error_code: null, error: "" });

        try {
            const res = await interceptor.get(`/api/posts/post/${postId}`);
            setPost(res.data.post);

        } catch (error) {
            if (error.response.status === 404) setError({ error_code: 404, error: "Post not found" });
            if (error.response.status === 401) setError({ error_code: 401, error: "You are not logged in!" });
            else setError({ error_code: 500, error: "Something went wrong." });
            console.log("Error fetching post:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!postId) return;
        fetchPost();
    }, [postId]);


    return (
        <main className={`w-screen min-h-dvh flex gap-4 ${bgColor}`}>
            <Sidebar />

            <section className="py-4 w-full h-full flex justify-center pr-4 max-md:px-4">
                {
                    loading
                        ?
                        <div className="text-lg font-semibold animate-pulse">Loading...</div>
                        :
                        error.error
                            ?
                            <div className="text-xl font-semibold text-red-500">{error.error}</div>
                            :
                            Object.keys(post || {})?.length > 0 && <PostCard p={post} setPosts={setPost} isOwner={user?._id === post?.userId} />
                }
            </section>
        </main>
    )
}
