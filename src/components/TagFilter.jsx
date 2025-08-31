import { useEffect, useState } from "react";
import interceptor from "../middleware/axiosInterceptor";
import useThemeStyles from "../hooks/useThemeStyles";
import { useNavigate } from "react-router-dom";

export default function TagsFilter() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const { grayText, tagsBg } = useThemeStyles();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrendingTags = async () => {
            setLoading(true);
            try {
                const res = await interceptor.get("/api/posts/get-tags");
                setTags(res.data?.tags || []);
            } catch (err) {
                console.error("Failed to fetch trending tags:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingTags();
    }, []);

    const handleTagClick = (tag) => {
        navigate(`/explore?tag=${encodeURIComponent(tag)}`);
    };

    return (
        <div>
            {loading ?
                <p className={`text-xs ${grayText}`}>Loading...</p>
                :
                <div className="flex flex-wrap gap-2">
                    {tags?.map((t) => (
                        <span key={t?._id} className={`px-3 py-1 text-xs ${tagsBg} rounded-full cursor-pointer`} onClick={() => handleTagClick(t.name)}>
                            #{t.name}
                        </span>
                    ))}
                </div>
            }
        </div>
    );
}
