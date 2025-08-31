import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';
import useThemeStyles from '../hooks/useThemeStyles';
import { toast } from 'sonner';
import { IoClose } from 'react-icons/io5';
import interceptor from '../middleware/axiosInterceptor';

export default function PostComposer() {
    const location = useLocation();
    const navigate = useNavigate();

    // Edit post
    const existingPost = location.state?.existingPost || null;
    const isEditMode = !!existingPost;

    // Create new post
    const { mediaFiles = [], mediaType } = location.state || {};
    const { bgColor, border, modalsBg, shadow, grayText, buttonStyle, blueButtonBg, tagsBg } = useThemeStyles();

    // Create video URL
    const vidURL = useMemo(() => {
        if (mediaType === 'image') return;
        if (isEditMode) {
            if (existingPost?.video) {
                return existingPost?.video;
            }
            return;
        }
        return URL.createObjectURL(mediaFiles?.[0]);
    }, [mediaFiles]);

    // states
    const [caption, setCaption] = useState(isEditMode ? existingPost?.caption : "");
    const [tags, setTags] = useState(isEditMode ? existingPost?.tags : []);
    const [suggestions, setSuggestions] = useState([]);
    const [disableComments, setDisableComments] = useState(isEditMode ? existingPost?.disable_comments : false);
    const [tagInput, setTagInput] = useState('');

    const [loading, setLoading] = useState(false);
    const [tagsSpinner, setTagsSpinner] = useState(false);

    // function to fetch tag suggestions
    const fetchTags = useCallback(async (searchTerm) => {
        if (!searchTerm.trim()) return setSuggestions([]);

        try {
            setTagsSpinner(true);
            const { data } = await interceptor.get(`/api/posts/get-tags?search=${searchTerm}`);
            setSuggestions(data.tags || []);
        } catch (err) {
            console.error("Error fetching tags:", err);
        } finally {
            setTagsSpinner(false);
        }
    }, []);

    // debounce tag search
    useEffect(() => {
        const delay = setTimeout(() => fetchTags(tagInput), 300);
        return () => clearTimeout(delay);
    }, [tagInput, fetchTags]);

    // video controls
    const videoRef = useRef();
    const [playing, setPlaying] = useState(false);

    const toggleVideoPlay = async () => {
        if (!videoRef.current) return;

        if (playing) {
            videoRef.current.pause();
            setPlaying(prev => !prev);
        } else {
            videoRef.current.play();
            setPlaying(prev => !prev);
        }
    };

    // Tags key down handler
    function showTagsSuggestion(e) {
        if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().replace(/^#/, '').toLowerCase();
            if (!tags.includes(newTag)) setTags([...tags, newTag]);
            setTagInput('');
            setSuggestions([]);
        }
        if (e.key === 'Backspace' && !tagInput && tags.length) {
            setTags(tags.slice(0, -1));
        }
    }

    // Submit handler
    const handleSubmit = async (draft) => {
        if (!mediaFiles.length && !isEditMode) return toast.error('No media selected.');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("caption", caption);
            tags.forEach(tag => formData.append("tags", tag));
            formData.append("disable_comments", disableComments);
            formData.append("draft", draft);

            if (mediaType === 'image') {
                mediaFiles.forEach(file => formData.append("images", file));
            } else if (mediaType === 'video') {
                formData.append("video", mediaFiles[0]);
            }

            await interceptor.post("/api/posts/create", formData, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success(draft ? 'Draft saved!' : 'Post uploaded!');
            navigate('/home', { replace: true });
        } catch (err) {
            console.error('Upload error:', err);
            toast.error(err.response?.data?.error || "Error uploading post");
        } finally {
            setLoading(false);
        }
    };

    // Edit post
    const handleEditSubmit = async (draft) => {
        setLoading(true);
        try {
            const payload = { caption, tags, disable_comments: disableComments, draft };
            await interceptor.patch(`/api/posts/${existingPost?._id}`, payload);

            toast.success("Post updated!");
            navigate(`/home`, { replace: true });
        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.response?.data?.error || "Error updating post");
        } finally {
            setLoading(false);
        }
    };


    return (
        <main className={`w-screen min-h-dvh flex justify-center items-center px-4 py-10 ${bgColor}`}>
            <div className={`p-6 border ${border} rounded-3xl w-full max-w-4xl space-y-6 ${modalsBg} shadow-md ${shadow}`}>
                <h2 className="text-2xl font-semibold text-center">{isEditMode ? "Edit Post" : "Compose Post"}</h2>

                {/* Media Preview */}
                <div className="overflow-x-auto w-full flex gap-4">
                    {
                        mediaType === 'video'
                            ?
                            <div className="relative w-64 shrink-0 aspect-video bg-black rounded-md">
                                <video
                                    ref={videoRef}
                                    src={vidURL}
                                    onEnded={() => { setPlaying(false); videoRef.current.pause() }}
                                    className="w-full h-full object-contain select-none"
                                />
                                <button type="button" onClick={() => toggleVideoPlay()} className="absolute inset-0 flex items-center justify-center text-white p-3">
                                    {!playing && <FaPlay />}
                                </button>
                            </div>
                            :
                            isEditMode
                                ?
                                existingPost?.images?.map((url, idx) => (
                                    <img
                                        src={url}
                                        alt={`url-${idx}`}
                                        className="w-64 shrink-0 aspect-video object-cover bg-black rounded-md"
                                    />
                                ))
                                :
                                mediaFiles?.map((media, idx) => (
                                    <img
                                        src={URL.createObjectURL(media)}
                                        alt={`media-${idx}`}
                                        className="w-64 shrink-0 aspect-video object-cover bg-black rounded-md"
                                    />
                                ))
                    }
                </div>

                {/* Caption */}
                <div>
                    <label htmlFor='caption' className={`block mb-1 text-sm font-medium`}>Caption</label>
                    <textarea
                        id='caption'
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className={`block w-full px-4 py-2 border rounded-xl resize-none focus:ring-blue-500 focus:border-blue-500 ${border}`}
                        rows={3}
                        placeholder="Write a caption..."
                    />
                </div>

                {/* Tags with suggestions */}
                <div>
                    <label htmlFor='tags' className={`block mb-1 text-sm font-medium`}>Tags</label>
                    <div className={`w-full flex flex-wrap gap-2 py-2 px-4 rounded-xl border ${border} relative`}>
                        {tags?.map((tag, idx) => (
                            <span key={idx} className={`flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full`}>
                                #
                                <span className='pb-0.5'>{tag}</span>
                                <button
                                    type="button"
                                    onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                                    className="text-blue-500 hover:text-red-500"
                                >
                                    <IoClose />
                                </button>
                            </span>
                        ))}
                        <input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value.toLowerCase())}
                            placeholder="Type and press enter..."
                            className="flex-1 min-w-[120px] border-none outline-none bg-transparent"
                            onKeyDown={showTagsSuggestion}
                        />
                        {tagsSpinner && <div className='w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin'></div>}

                        {suggestions?.length > 0 && (
                            <div className={`absolute top-full left-0 mt-1 w-full max-h-40 overflow-y-auto ${modalsBg} shadow-lg ${shadow} rounded-lg border ${border} z-10`}>
                                {suggestions?.map((s, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => {
                                            if (!tags.includes(s.name)) setTags([...tags, s.name]);
                                            setTagInput('');
                                            setSuggestions([]);
                                        }}
                                        className="block w-full text-left px-4 py-2"
                                    >
                                        #{s.name} <span className={`${grayText} text-[0.75rem]`}>- used {s.usageCount || 0} times</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Disable comments */}
                <div className={`space-y-3 p-4 border ${border} rounded-xl ${tagsBg}`}>
                    <div>
                        <h4 className="text-base font-medium">Disable comments</h4>
                        <p className={`text-sm ${grayText}`}>If enabled, others will not be able to comment on your post.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input checked={disableComments} onChange={() => setDisableComments(prev => !prev)} id="disable-comments" type="checkbox" className="w-4 h-4 accent-black rounded cursor-pointer" />
                        <label htmlFor="disable-comments" className="cursor-pointer select-none">Disable comments</label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-between gap-4 pt-4">
                    <button
                        disabled={loading}
                        onClick={() => navigate(-1)}
                        className={`py-2 px-4 disabled:opacity-50 text-white rounded-xl ${buttonStyle} transition duration-200 cursor-pointer`}
                    >
                        Back
                    </button>

                    <div className="flex gap-4">
                        <button
                            disabled={loading}
                            onClick={() => { isEditMode ? handleEditSubmit(true) : handleSubmit(true) }}
                            className="px-4 py-2 disabled:opacity-50 bg-yellow-500 hover:bg-yellow-600/80 text-white rounded-xl font-medium"
                        >
                            {
                                loading
                                    ?
                                    isEditMode ? "Updating..." : "Saving..."
                                    :
                                    isEditMode ? "Update Draft" : "Save as Draft"
                            }
                        </button>

                        <button
                            disabled={loading}
                            onClick={() => { isEditMode ? handleEditSubmit(false) : handleSubmit(false) }}
                            className={`px-4 py-2 disabled:opacity-50 ${blueButtonBg} text-white rounded-xl font-medium`}
                        >
                            {
                                loading
                                    ?
                                    isEditMode ? "Updating..." : "Posting..."
                                    :
                                    isEditMode ? "Update" : "Post"
                            }
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
