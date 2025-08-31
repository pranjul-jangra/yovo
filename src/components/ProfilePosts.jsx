import { useState } from "react";
import { RiDraftFill } from "react-icons/ri";
import { BsFilePost } from "react-icons/bs";
import useThemeStyles from "../hooks/useThemeStyles";
import PostGrid from "./PostGrid";
import DraftPostsGrid from "./DraftPostsGrid";

export default function ProfilePosts({ userId = "me" }) {
    const { grayText, border } = useThemeStyles();
    const [activeTab, setActiveTab] = useState("posts");

    return (
        <>
            <section
                className={`w-full flex justify-center mt-6 border-t py-3 ${border} *:flex *:items-center *:gap-1.5 *:cursor-pointer`}
            >
                <button type="button" onClick={() => setActiveTab("posts")} className={`${activeTab !== "posts" ? grayText : ""} px-6 border-x ${border}`}>
                    <BsFilePost /> Posts
                </button>
                {userId === "me" && <button type="button" onClick={() => setActiveTab("drafts")} className={`${activeTab !== "drafts" ? grayText : ""} px-6 border-x ${border}`}>
                    <RiDraftFill /> Drafts
                </button>}
            </section>

            {
                activeTab === "posts"
                    ?
                    <PostGrid userId={userId} type={activeTab} />
                    :
                    <DraftPostsGrid />
            }
        </>
    );
}
