import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import useThemeStyles from "../hooks/useThemeStyles";
import { useState } from "react";
import interceptor from "../middleware/axiosInterceptor";

export default function SearchResultList({ posts, users, tags, showLimited, setResults }) {
    const navigate = useNavigate();
    const { grayText, border, tagsBg, blueText } = useThemeStyles();
    const [loadingMore, setLoadingMore] = useState(false);

    // Load more results from backend (paginated search)
    const handleLoadMore = async (type) => {
        if (loadingMore) return;
        setLoadingMore(true);
        try {
            const lastItemId = {
                posts: posts[posts.length - 1]?._id,
                users: users[users.length - 1]?._id,
                tags: tags[tags.length - 1]?._id,
            }[type];

            const res = await interceptor.get(`/api/explore/search/more`, {
                params: { q: "", type, cursor: lastItemId },
            });

            setResults((prev) => ({
                ...prev,
                [res.data.type]: [...prev[res.data.type], ...res.data.items],
            }));

        } catch (err) {
            console.error("Failed to load more search results:", err);
        } finally {
            setLoadingMore(false);
        }
    };

    // Limit items if preview mode
    const limitedPosts = showLimited ? posts.slice(0, 10) : posts;
    const limitedUsers = showLimited ? users.slice(0, 10) : users;
    const limitedTags = showLimited ? tags.slice(0, 7) : tags;

    return (
        <div className="space-y-4 overflow-auto h-[70dvh]" data-lenis-prevent>
            {/* Users */}
            {limitedUsers.length > 0
                ?
                <div>
                    <h4 className={`text-sm font-medium ${grayText} mb-1`}>Users</h4>
                    {limitedUsers.map((u) => (
                        <motion.div
                            key={u._id}
                            className={`p-2 cursor-pointer rounded-md border ${border} mb-1`}
                            onClick={() => navigate(`/profile/${u?._id}`)}
                        >
                            <div className="flex items-center gap-2">
                                <img src={u?.avatar || '/user.png'} alt={u?.username} className="w-7 h-7 rounded-full" />
                                <div>
                                    <p className="text-sm font-medium">{u.username}</p>
                                    <p className={`text-xs ${grayText}`}>{u.profile_name || ''}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {users.length > limitedUsers.length && (
                        <button className={`text-xs ${blueText} mt-1`} onClick={() => handleLoadMore("users")}>
                            Load more users
                        </button>
                    )}
                </div>
                :
                <p className={`text-center text-sm ${grayText} mb-4 pb-4 border-b ${border}`}>No user found.</p>
            }

            {/* Tags */}
            {/* {limitedTags.length > 0 && (
                <div>
                    <h4 className={`text-sm font-medium ${grayText} mb-1`}>Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {limitedTags.map((t) => (
                            <span
                                key={t._id}
                                className={`px-2 py-1 text-xs ${tagsBg} rounded-lg cursor-pointer`}
                                onClick={() => handleTagClick(t.name)}
                            >
                                #{t.name}
                            </span>
                        ))}
                    </div>
                    {tags.length > limitedTags.length && (
                        <button className="text-xs text-blue-500 mt-1" onClick={() => handleLoadMore("tags")}>
                            Load more tags
                        </button>
                    )}
                </div>
            )} */}

            {/* Posts */}
            {limitedPosts.length > 0
                ?
                <div>
                    <h4 className={`text-sm font-medium ${grayText} mb-1`}>Posts</h4>
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                        {limitedPosts.map((p) => (
                            <motion.img
                                key={p._id}
                                src={p.images?.[0]}
                                alt={`${p.caption.slice(0, 50)}...`}
                                className="w-full h-44 object-cover rounded-md cursor-pointer"
                                onClick={() => navigate(`/post/${p?.postId}`)}
                            />
                        ))}
                    </div>
                    {posts.length > limitedPosts.length && (
                        <button className={`text-xs ${blueText} mt-1`} onClick={() => handleLoadMore("posts")}>
                            Load more posts
                        </button>
                    )}
                </div>
                :
                <p className={`text-center text-sm ${grayText}`}>No post found.</p>
            }
        </div>
    );
}
