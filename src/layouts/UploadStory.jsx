import React, { useRef, useState } from "react";
import { FaCloudUploadAlt, FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import useThemeStyles from "../hooks/useThemeStyles";

const UploadStory = () => {
    const { modalsBg, border, primaryText, grayText, bgColor } = useThemeStyles();

    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const videoRef = useRef(null);
    const prevPreviewRef = useRef(null);

    // Handle file selection (revoke previous preview URL to avoid leaks)
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // revoke previous preview
        if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);
        const blobUrl = URL.createObjectURL(file);
        prevPreviewRef.current = blobUrl;

        setMedia(file);
        setMediaPreview(blobUrl);
        setIsPlaying(false);
    };

    // Remove selected file
    const handleRemoveFile = () => {
        if (prevPreviewRef.current) {
            URL.revokeObjectURL(prevPreviewRef.current);
            prevPreviewRef.current = null;
        }
        setMedia(null);
        setMediaPreview(null);
        setIsPlaying(false);
    };

    // Play/Pause video manually
    const togglePlayPause = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            // ensure muted/playsInline if desired; keeping user-initiated play only
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    // Submit (stub)
    const handleSubmit = () => {
        if (!media) {
            alert("Please select a file.");
            return;
        }
        console.log({ media });
        // TODO: upload using axios
    };

    return (
        <main className={`w-screen min-h-dvh ${bgColor} flex justify-center items-center`}>
            <div className={`max-w-2xl w-full mx-auto p-5 rounded-xl border ${border} ${modalsBg}`}>
                <h2 className={`text-xl font-semibold mb-4 ${primaryText}`}>Add a Story</h2>

                <div className="space-y-4">
                    {/* Relative wrapper so overlay buttons can be siblings (not inside the label) */}
                    <div
                        className="relative w-full h-64"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Label (clicking it opens file picker) */}
                        <label
                            htmlFor="story-media"
                            className={`block w-full h-full rounded-lg border-2 border-dashed ${border} cursor-pointer overflow-hidden flex items-center justify-center`}
                        >
                            {mediaPreview ? (
                                media?.type?.startsWith("video") ? (
                                    // video without native controls
                                    <video
                                        ref={videoRef}
                                        src={mediaPreview}
                                        className="w-full h-full object-cover"
                                        onEnded={() => setIsPlaying(false)}
                                        playsInline
                                        preload="metadata"
                                        // pointer-events none so clicks fall through to the label (to open picker)
                                        style={{ pointerEvents: "none" }}
                                    />
                                ) : (
                                    // image preview
                                    <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                                )
                            ) : (
                                // placeholder
                                <div className="flex flex-col items-center justify-center">
                                    <FaCloudUploadAlt size={40} className="mb-2 text-gray-400" />
                                    <p className={`${grayText} text-sm`}>Click to select image or video</p>
                                </div>
                            )}

                            <input
                                id="story-media"
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>

                        {/* Overlay area: pointer-events-none allows clicks to fall through to the label except on the buttons */}
                        {mediaPreview && media?.type?.startsWith("video") && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {/* Play button shown when not playing */}
                                {!isPlaying ? (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // just in case
                                            togglePlayPause();
                                        }}
                                        className="pointer-events-auto flex items-center justify-center text-white bg-black bg-opacity-40 hover:bg-opacity-50 rounded-full p-2 transition"
                                        aria-label="Play video"
                                    >
                                        <FaPlayCircle size={60} />
                                    </button>
                                ) : (
                                    // Pause button shown only on hover while playing
                                    isHovered && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePlayPause();
                                            }}
                                            className="pointer-events-auto flex items-center justify-center text-white bg-black bg-opacity-40 hover:bg-opacity-50 rounded-full p-2 transition"
                                            aria-label="Pause video"
                                        >
                                            <FaPauseCircle size={60} />
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Remove File Button */}
                    {media && (
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="w-full py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                        >
                            Remove Selected File
                        </button>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-6 w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition"
                >
                    Post Story
                </button>
            </div>
        </main>
    );
};

export default UploadStory;
