import React from "react";
import useThemeStyles from "../hooks/useThemeStyles";
import Sidebar from "../components/Sidebar";

// Dummy saved posts data
const savedPosts = [
    {
        id: 1,
        image: "/dummy2.jpg",
        caption: "Sunset vibes 🌅",
    },
    {
        id: 2,
        image: "/dummy1.jpeg",
        caption: "Throwback to Goa!",
    },
    {
        id: 3,
        image: "/user.png",
        caption: "Minimal workspace setup 🎧",
    },
    {
        id: 4,
        image: "/yovo.png",
        caption: "Out with the crew 🍕",
    },
];

export default function Saved() {
    const { bgColor, grayText, modalsBg, border, shadow } = useThemeStyles();

    return (
        <main className="flex">
            <Sidebar />

            <div className={`${bgColor} py-10 px-4 w-full min-h-dvh`}>
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold mb-8 text-center">Saved Posts</h1>

                    {savedPosts.length === 0 ? (
                        <p className={`${grayText} text-center`}>You haven't saved any posts yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {savedPosts.map((post) => (
                                <div key={post.id} className={`${modalsBg} ${border} ${shadow} rounded-xl overflow-hidden group relative`}>
                                    <img src={post.image} alt="" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/70 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-sm p-2 text-center">
                                        {post.caption}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
