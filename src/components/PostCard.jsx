import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from "react-router-dom";
import useThemeStyles from "../hooks/useThemeStyles";
import { FaComment, FaShare, FaHeart, FaRegHeart } from "react-icons/fa6";
import { LuImages } from "react-icons/lu";
import { BsPlayCircle, BsThreeDotsVertical } from "react-icons/bs";
import { timeAgo } from '../utils/timeAgo';
import interceptor from '../middleware/axiosInterceptor';
import CommentsModal from "./CommentsModal";
import SharePost from "./SharePost";
import { toast } from "sonner";
import useLoaderStore from "../store/loaderStore";


export default function PostCard({ p, setPosts, setPostData, closeModal, isModal = false, isOwner = false }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { grayText, border, modalsBg, hoverBg, bgColor, blueButtonBg, grayButtonBg } = useThemeStyles();
    const { setScreenLoader } = useLoaderStore();

    // Video play handling
    const videoRef = useRef();
    const [playing, setPlaying] = useState(false);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (playing) {
            videoRef.current.pause();
            setPlaying(prev => !prev);
        } else {
            videoRef.current.play();
            setPlaying(prev => !prev);
        }
    }

    // Other features
    const [currentIndex, setCurrentIndex] = useState(1);
    const [showCompleteCaption, setShowCompleteCaption] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [sharePost, setSharePost] = useState({ state: false, postId: "" });
    const [postId, setPostId] = useState(null);
    const menuRef = useRef();

    // Image scrolling logic
    function updateIndex(e) {
        const container = e.target;
        const scrollLeft = container.scrollLeft;
        const childWidth = container.firstChild?.offsetWidth || 1;
        const index = Math.round(scrollLeft / childWidth) + 1;
        setCurrentIndex(Math.min(p?.images?.length ?? 1, index));
    }

    // Close context menu on window click or scroll
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("scroll", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.addEventListener("scroll", handleClickOutside);
        }
    }, []);

    // Update visible image index
    function updateIndex(e) {
        const container = e.target;
        const scrollLeft = container.scrollLeft;
        const childWidth = container.firstChild?.offsetWidth || 1;
        const index = Math.round(scrollLeft / childWidth) + 1;
        setCurrentIndex(index);
    }

    // Increament share count on sharing post
    const handleShare = async (platformUrl) => {
        try {
            window.open(platformUrl, "_blank");
            await interceptor.post(`/api/posts/${p?.postId}/share`);
        } catch (err) {
            console.error("Error sharing post:", err);
        }
    };

    // Report post
    const handleReport = () => navigate('/report', {
        state: { reportType: "post", targetId: p?._id }
    });

    // hide post
    const hidePost = async () => {
        try {
            await interceptor.post(`/api/post-action/hide/${p?._id}`);
            setShowMenu(false);
            toast.success("Your post is hidden now.");

            if (setPosts) {
                setPosts(prev => prev.map(post => post?._id === p?._id
                    ? { ...post, hide_post: !post?.hide_post }
                    : post
                ));
            }

        } catch (error) {
            console.log("Error hiding post:", error);
        }
    }

    // Unhide post
    const UnhidePost = async () => {
        try {
            await interceptor.post(`/api/post-action/unhide/${p?._id}`);
            setShowMenu(false);
            toast.success("Your post is accessible now.");

            if (setPosts) {
                setPosts(prev => prev.map(post => post?._id === p?._id
                    ? { ...post, hide_post: !post?.hide_post }
                    : post
                ));
            }

        } catch (error) {
            console.log("Error unhiding post:", error);
        }
    }

    // Delete post
    const handleDeletePost = async (id) => {
        setScreenLoader(true);
        try {
            await interceptor.delete(`/api/posts/${id}`);
            setShowMenu(false);
            toast.success("Post deleted.");

            if (closeModal) {
                closeModal();
            }
            if (setPosts) {
                setPosts(prev => prev.filter(post => post?._id !== id));
            }

        } catch (error) {
            console.log("Error deleting post:", error);
        } finally {
            setScreenLoader(false);
        }
    }

    // Edit post
    const handleEditPost = async () => {
        navigate('/home/create/compose', { state: { existingPost: p } });
    }

    // Toggle like
    const handleLike = async () => {
        try {
            await interceptor.post(`/api/posts/${p?._id}/like`);
            if (p.isLiked) {
                setPosts(prev => {
                    return Array.isArray(prev) ?
                        prev?.map(post => {
                            return post?._id === p?._id ? { ...post, isLiked: false, likes_count: post?.likes_count - 1 } : post
                        }) :
                        { ...prev, isLiked: false, likes_count: prev?.likes_count - 1 }
                });

                // State update on profile page
                if (setPostData) {
                    setPostData(prev => ({ ...prev, isLiked: false, likes_count: prev?.likes_count - 1 }))
                }
            } else {
                setPosts(prev => {
                    return Array.isArray(prev)
                        ? prev.map(post => {
                            return post?._id === p?._id ? { ...post, isLiked: true, likes_count: post?.likes_count + 1 } : post
                        })
                        : { ...prev, isLiked: true, likes_count: prev?.likes_count + 1 };
                });

                // State update on profile page
                if (setPostData) {
                    setPostData(prev => ({ ...prev, isLiked: true, likes_count: prev?.likes_count + 1 }))
                }
            }

        } catch (error) {
            console.log("Error liking post:", error);
        }
    }

    // Body lock
    useEffect(() => {
        if (sharePost.state || postId) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [sharePost, postId]);

    // Follow | Unfollow
    const handleFollow = async () => {
        try {
            await interceptor.post(`/api/follow/${p?.userId}`);

            setPosts(prev => {
                return Array.isArray(prev) ?
                    prev?.map(post => {
                        return post?.userId === p?.userId ? { ...post, isFollowing: !post?.isFollowing } : post
                    }) :
                    { ...prev, isFollowing: !prev?.isFollowing }
            });

            if (setPostData) {
                setPostData(prev => ({ ...prev, isFollowing: !prev?.isFollowing }))
            }

        } catch (error) {
            console.log("Error following user:", error);
            toast.error("Error following user");
        }
    }

    // Conditional checks
    const isMyProfilePage = location?.pathname?.includes("/profile/me");


    return (
        <>
            <section className={`w-full flex flex-col ${isModal ? "h-[90vh] max-h-screen max-w-[95%] md:max-w-[850px]" : "max-w-2xl"} border ${border} ${bgColor} p-3 rounded-2xl relative`} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <section className="flex justify-between items-center gap-5 mb-2.5 relative flex-shrink-0">
                    <div className="flex gap-3 items-center cursor-default" onClick={() => navigate(`/profile/${p.user ? p.user?.[0]?._id : p?.userId?._id}`)} >
                        <img loading="lazy" src={p?.user ? p?.user?.[0]?.avatar : p?.userId?.avatar} alt="avatar" className="w-8 aspect-square object-cover rounded-lg text-xs" />
                        <div>
                            <p className="whitespace-nowrap truncate leading-4 text-sm">
                                {
                                    p?.user
                                        ? p?.user?.[0]?.profile_name || p?.user?.[0]?.username || "yovo_user"
                                        : p?.userId?.profile_name || p?.userId?.username || "yovo_user"
                                }
                            </p>
                            <p className={`${grayText} text-[0.8rem]`}>{timeAgo(p?.createdAt)}</p>
                        </div>

                        {/* Follow button */}
                        {
                            !isOwner &&
                            !p?.isFollowing &&
                            p?.user?.[0]?.username &&
                            !location.pathname?.includes("/profile") && (
                                <button className={`${p?.isFollowing ? grayButtonBg : blueButtonBg} px-3 pt-0.5 pb-1 rounded-md text-sm`} type="button" onClick={e => { e.stopPropagation(); handleFollow(); }}>
                                    {p?.isFollowing ? "Following" : "Follow"}
                                </button>
                            )
                        }
                    </div>

                    <div className="relative" ref={menuRef}>
                        <BsThreeDotsVertical className="cursor-pointer" onClick={() => setShowMenu(prev => !prev)} />
                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute min-w-44 top-6 right-0 z-50 shadow-md rounded-lg ${modalsBg} border ${border} text-sm`}
                                >
                                    {isOwner || isMyProfilePage ? (
                                        // Own post options
                                        <ul className="min-w-[120px] py-2">
                                            <li className={`px-4 py-1.5 ${hoverBg} cursor-pointer`} onClick={handleEditPost}>
                                                Edit
                                            </li>
                                            <li className={`px-4 py-1.5 ${hoverBg} cursor-pointer`} onClick={() => handleDeletePost(p?._id)}>
                                                Delete
                                            </li>
                                            <li className={`px-4 py-1.5 ${hoverBg} cursor-pointer`} onClick={p?.hide_post ? UnhidePost : hidePost}>
                                                {p?.hide_post ? "Unhide" : "Hide"}
                                            </li>
                                        </ul>
                                    ) : (
                                        // Other user's post options
                                        <ul className="min-w-[120px] py-2">
                                            <li onClick={handleReport} className={`px-4 py-1.5 ${hoverBg} cursor-pointer`} >
                                                Report this post
                                            </li>
                                            {!location.pathname?.includes("/profile") && (
                                                <li onClick={handleFollow} className={`px-4 py-1.5 ${hoverBg} cursor-pointer`}>
                                                    {p?.isFollowing ? "Unfollow" : "Follow"}
                                                </li>
                                            )}
                                        </ul>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Main content */}
                <section className={`flex-1 w-full overflow-hidden ${isModal ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col"}`}>
                    {/* Left: Media */}
                    <div className={`flex overflow-hidden image-container w-full ${isModal ? "h-72 md:h-full" : "aspect-square"} rounded-lg relative`} onScroll={updateIndex} >
                        <div className="flex w-full h-full overflow-x-auto image-container" onScroll={updateIndex}>
                            {p?.video
                                ?
                                <div className="w-full h-full flex-shrink-0 relative">
                                    <video src={p.video} className="w-full h-full object-cover" ref={videoRef} />
                                    <div onClick={togglePlay} className={`absolute inset-0 z-10 flex justify-center items-center ${playing ? "" : "bg-black/20"}`}>
                                        {!playing && <BsPlayCircle className="text-4xl" />}
                                    </div>
                                </div>
                                :
                                p?.images?.map((image, i) => (
                                    <img loading="lazy" key={`image-${i}`} src={image} alt={`image-${i + 1}`} className="w-full h-full flex-shrink-0 object-cover" />
                                ))
                            }
                        </div>

                        {p?.images?.length > 0 && (
                            <span className="absolute bottom-2 right-2 py-1 px-2 bg-gray-800/70 text-white text-[12px] rounded-lg flex items-center gap-1 z-10">
                                <LuImages /> {`${currentIndex}/${p.images.length}`}
                            </span>
                        )}
                    </div>

                    {/* Right: Caption + Actions */}
                    <div
                        className={`${isModal ? `h-full flex flex-col justify-between overflow-hidden md:border-l ${border}` : ""}`}>
                        {/* Caption first in modal */}
                        {isModal && (
                            <div className="flex-1 overflow-y-auto px-3 md:pl-5 md:pr-2 mt-3 md:mt-0">
                                {p?.caption ? (
                                    <p className={`text-[12px] ${grayText} tracking-wide whitespace-pre-wrap`} >
                                        {showCompleteCaption ? (
                                            p.caption
                                        ) : p.caption.length > 150 ? (
                                            <span>
                                                {p.caption.slice(0, 150)} ...{" "}
                                                <i className="cursor-pointer underline" onClick={() => setShowCompleteCaption(true)} >
                                                    Read more
                                                </i>
                                            </span>
                                        ) : (
                                            p.caption
                                        )}
                                    </p>
                                ) : (
                                    <p className={`text-[12px] ${grayText} tracking-wide text-center`}>
                                        No caption...
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div
                            className={`flex items-center flex-shrink-0 ${isModal ? `gap-6 border-t ${border} pt-4 px-3 md:px-5 pb-2` : "gap-4 mt-4"}`}>
                            <button type="button" className={`text-[12px] ${grayText} flex items-center gap-1 cursor-pointer`} onClick={handleLike} >
                                {p?.isLiked ? (
                                    <FaHeart className="text-xl text-red-500" />
                                ) : (
                                    <FaRegHeart className="text-xl" />
                                )}
                                {parseInt(p?.likes_count ?? 0)}
                            </button>

                            {!p?.disable_comments && <button type="button" className={`text-[12px] ${grayText} flex items-center gap-1 cursor-pointer`} onClick={() => setPostId(p?._id)} >
                                <FaComment className="text-xl" />{" "}
                                {parseInt(p?.comments_count ?? 0)}
                            </button>}

                            <button type="button" className={`text-[12px] ${grayText} flex items-center gap-1 cursor-pointer`} onClick={() => setSharePost(() => ({ state: true, postId: p?.postId }))} >
                                <FaShare className="text-xl" /> {parseInt(p?.share_count ?? 0)}
                            </button>
                        </div>

                        {/* Caption after buttons in normal mode */}
                        {!isModal && p?.caption && (
                            <p className={`text-[12px] ${grayText} mt-2 tracking-wide whitespace-pre-wrap`} >
                                {showCompleteCaption ? (
                                    p.caption
                                ) : p.caption.length > 150 ? (
                                    <span>
                                        {p.caption.slice(0, 150)} ...{" "}
                                        <i className="cursor-pointer underline" onClick={() => setShowCompleteCaption(true)}>
                                            Read more
                                        </i>
                                    </span>
                                ) : (
                                    p.caption
                                )}
                            </p>
                        )}

                        {!isModal && !p?.caption && (
                            <p className={`text-[12px] ${grayText} mt-2 tracking-wide text-center`} >
                                No caption...
                            </p>
                        )}
                    </div>
                </section>
            </section>

            <AnimatePresence>
                {/* Comments modal */}
                {postId && (
                    <CommentsModal
                        onClose={() => setPostId(null)}
                        caption={p?.caption}
                        tags={p?.tags}
                        postId={postId}
                        setPosts={setPosts}
                        setPostData={setPostData}
                    />
                )}

                {/* Share post options */}
                {sharePost.state && (
                    <SharePost onClose={() => setSharePost({ state: false, postId: "" })} onShare={handleShare} postId={sharePost.postId || ""} />
                )}
            </AnimatePresence>
        </>

    );
}