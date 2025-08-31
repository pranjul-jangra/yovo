import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import useThemeStyles from "../hooks/useThemeStyles";
import { IoMdClose } from "react-icons/io";
import interceptor from '../middleware/axiosInterceptor';
import useAuthStore from "../store/authStore";


const CommentsModal = ({ onClose, postId, setPosts, setPostData, caption = "", tags = [] }) => {
  const { modalsBg, border, grayText, blueText, shadow, blueButtonBg } = useThemeStyles();
  const { user } = useAuthStore();

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsBucket, setCommentsBucket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const res = await interceptor.get(`/api/posts/${postId}/comments`, {
        params: { cursor },
      });

      setComments(prev => {
        const newOnes = res.data.comments.filter(
          c => !prev.some(p => p._id === c._id)
        );
        return [...prev, ...newOnes];
      });

      setCommentsBucket(prev => [
        ...prev,
        ...new Array(res.data.comments.length).fill(false),
      ]);
      setHasMore(res.data.hasMore);
      setCursor(res.data.nextCursor);
    } catch (error) {
      console.log("Error getting comments:", error);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading, postId]);

  useEffect(() => {
    fetchComments();
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) fetchComments();
    });
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [fetchComments, hasMore, loading]);

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await interceptor.post(`/api/posts/${postId}/comment`, { text: newComment });

      const addedComment = {
        text: res.data.comment.text,
        userId: {
          avatar: user?.avatar,
          profile_name: user?.profile_name,
          username: user?.username
        }
      };
      setComments(prev => [addedComment, ...prev]);
      setCommentsBucket(prev => [false, ...prev]);
      setNewComment("");

      setPosts(prev => {
        return Array.isArray(prev)
          ? prev.map(post => {
            return post._id === postId ? { ...post, comments_count: post.comments_count + 1 } : post
          })
          : { ...prev, comments_count: prev.comments_count + 1 };
      });

      // State update on profile page
      if (setPostData) {
        setPostData(prev => ({ ...prev, comments_count: prev.comments_count + 1 }))
      }

    } catch (error) {
      console.log("Error adding comment:", error);
    }
  };

  return (
    <motion.section
      initial={{ background: 'rgba(0,0,0,0.01)' }}
      animate={{ background: 'rgba(0,0,0,0.3)' }}
      exit={{ background: 'rgba(0,0,0,0.01)' }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-2xl max-h-[80vh] min-h-[75vh] flex flex-col justify-between overflow-hidden rounded-2xl p-4 ${modalsBg} ${shadow} border ${border} relative`}
      >
        {/* Close Button */}
        <button onClick={onClose} className={`absolute top-3 right-3 text-xl hover:opacity-75`}>
          <IoMdClose />
        </button>

        <div className="overflow-y-auto space-y-6 pr-2 pb-1">
          {/* Metadata */}
          <div className={`border-b ${border} pb-3`}>
            {caption && <p className={`text-base`}>{caption}</p>}

            {tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span key={idx} className={`text-sm bg-opacity-20 ${blueText}`}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="mt-2 space-y-4">
            {comments.length === 0 && !loading
              ? <p className={`text-sm text-center italic ${grayText}`}>No comments yet.</p>
              : comments.map((c, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <img src={c?.userId?.avatar || '/user.png'} alt="" className="w-8 h-8 rounded-full object-cover" />

                  <div className="flex flex-col">
                    <span className={`text-sm leading-4 font-semibold`}>{c?.userId?.profile_name || c?.userId?.username}</span>
                    <span className={`text-sm ${grayText}`}>
                      {c.text.length > 80 ? (
                        commentsBucket[i]
                          ? (
                            <>
                              {c.text}{" "}
                              <span
                                onClick={() =>
                                  setCommentsBucket(prev =>
                                    prev.map((val, idx) => (idx === i ? false : val))
                                  )
                                }
                                className="cursor-pointer text-sm font-medium underline"
                              >
                                Read less
                              </span>
                            </>
                          ) : (
                            <>
                              {c.text.slice(0, 80)}...{" "}
                              <i
                                onClick={() =>
                                  setCommentsBucket(prev =>
                                    prev.map((val, idx) => (idx === i ? true : val))
                                  )
                                }
                                className="cursor-pointer text-sm font-medium underline"
                              >
                                Read more
                              </i>
                            </>
                          )
                      ) : c.text}
                    </span>
                  </div>
                </div>
              ))
            }

            {/* Loader + Observer target */}
            <div ref={loaderRef} className="flex justify-center py-2">
              {loading && <div className={`w-6 h-6 border-2 border-dotted rounded-full ${grayText} animate-spin`}></div>}
            </div>
          </div>
        </div>

        {/* Comment input */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className={`flex-1 px-3 py-2 rounded-xl border ${border} outline-none`}
            onKeyDown={e => { if (e.key === "Enter") { handleAddComment() } }}
          />
          <button onClick={handleAddComment} className={`px-4 py-2 rounded-xl ${blueButtonBg} text-white`}>
            Post
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default CommentsModal;
