import { useState, useEffect, useRef, useCallback } from "react";
import useThemeStyles from "../hooks/useThemeStyles";
import interceptor from '../middleware/axiosInterceptor';
import { FaTrash, FaEdit } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import useLoaderStore from "../store/loaderStore";
import { useNavigate } from "react-router-dom";

export default function DraftPostsGrid() {
    const { border, grayText, blueText, grayButtonBg, redButtonBg, yellowButtonBg } = useThemeStyles();
    const { setScreenLoader } = useLoaderStore();
    const navigate = useNavigate();

    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loaderRef = useRef(null);

    // Fetch drafts with pagination
    const fetchDrafts = useCallback(async (pageNum) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const res = await interceptor.get(`/api/posts/drafts?page=${pageNum}&limit=10`);
            const { drafts: newDrafts, totalPages } = res.data;

            if (pageNum === 1) {
                setDrafts(newDrafts);
            } else {
                setDrafts((prev) => [...prev, ...newDrafts]);
            }

            setHasMore(pageNum < totalPages);
        } catch (err) {
            console.error("Error fetching drafts:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchDrafts(1);
    }, [fetchDrafts]);

    // Infinite scroll observer
    useEffect(() => {
        if (!loaderRef.current || !hasMore || loadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore && hasMore) {
                    setPage((prev) => {
                        const nextPage = prev + 1;
                        fetchDrafts(nextPage);
                        return nextPage;
                    });
                }
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [fetchDrafts, hasMore, loadingMore]);

    // Publish draft
    const handlePublish = async (postId) => {
        setScreenLoader(true);
        try {
            await interceptor.patch(`/api/posts/${postId}/publish`);
            setDrafts((prev) => prev.filter((p) => p.postId !== postId));
        } catch (err) {
            console.error("Error publishing draft:", err);
        } finally{
            setScreenLoader(false);
        }
    };

    // Delete draft
    const handleDelete = async (postId) => {
        setScreenLoader(true);
        try {
            await interceptor.delete(`/api/posts/${postId}`);
            setDrafts((prev) => prev.filter(p => p._id !== postId));
        } catch (err) {
            console.error("Error deleting draft:", err);
        } finally{
            setScreenLoader(false);
        }
    };

    // Edit post
    const handleEditPost = async (post) => {
        navigate('/home/create/compose', { state: { existingPost: post } });
    }


    return (
        <main>
            <section className="w-full p-4 mt-4 pb-10">
                {loading && <p className="text-center">Loading drafts...</p>}
                {!loading && drafts.length === 0 && <p className={`${grayText} text-sm text-center`}>No drafts saved.</p>}

                {/* Draft posts */}
                <section className="grid grid-cols-3 gap-3 max-w-4xl mx-auto">
                    {drafts.map((draft) => (
                        <div key={draft.postId} className={`rounded-2xl p-2 border ${border} shadow-sm flex flex-col`}>
                            {/* Media preview */}
                            {draft?.images?.length > 0 ?
                                <img src={draft?.images[0]} alt="draft preview" className="w-full h-44 object-cover rounded-xl" />
                                : draft.video ?
                                    <video controls src={draft?.video} className="w-full max-h-64 rounded-xl" />
                                    :
                                    <p className={`h-40 flex items-center justify-center ${grayText} border rounded-xl`}> No media</p>
                            }

                            {/* Caption */}
                            <p className="mt-2 text-sm truncate">{draft?.caption?.slice(0, 50) || "No caption"}</p>

                            {/* Tags */}
                            {draft.tags?.length > 0 && (
                                <p className={`text-xs ${grayText} mt-1`}>Tags: {draft?.tags?.join(", ")} </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 mt-3 *:border *:flex *:items-center *:gap-2 *:px-3 *:py-1 *:rounded-full *:text-sm *:cursor-pointer">
                                <button onClick={() => handlePublish(draft?.postId)} className={`${grayButtonBg} ${blueText}`}>
                                    <MdOutlineFileUpload /> Publish
                                </button>
                                <button onClick={() => handleDelete(draft?._id)} className={`${redButtonBg}`}>
                                    <FaTrash /> Delete
                                </button>
                                <button className={`${yellowButtonBg}`} onClick={() => handleEditPost(draft)}>
                                    <FaEdit /> Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Infinite scroll loader */}
                <div ref={loaderRef} className="h-10 flex items-center justify-center mt-4">
                    {loadingMore && <p className="text-center">Loading more drafts...</p>}
                    {!hasMore && !loading && !loadingMore && drafts.length > 0 && (
                        <p className={`text-sm ${grayText} text-center mt-6`}>No more drafts</p>
                    )}
                </div>
            </section>
        </main>
    );
}
