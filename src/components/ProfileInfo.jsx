import { useState } from 'react';
import { FaLink } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import useThemeStyles from '../hooks/useThemeStyles'
import { useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { platformIcons } from "../utils/socialMediaPlatformOptions";
import { BsGenderAmbiguous } from 'react-icons/bs';
import { GiClover } from "react-icons/gi";
import interceptor from '../middleware/axiosInterceptor';
import { toast } from 'sonner';


export default function ProfileInfo() {
    const navigate = useNavigate();
    const { grayText, blueButtonBg, buttonStyle, grayButtonBg } = useThemeStyles();
    const { user, otherUser, setUser, setOtherUser } = useAuthStore();
    const { userId } = useParams();

    const data = userId === "me" ? user : otherUser;
    const {
        profile_name,
        avatar = "/user.png",
        bio,
        DOB,
        marital_status,
        gender,
        profile_website,
        social_links = [],
        followers_count = 0,
        following_count = 0,
        total_posts = 0,
        isFollowing
    } = data || {};

    const [expandedBio, setExpandedBio] = useState(false);

    // Follow | Unfollow
    const handleFollow = async () => {
        try {
            await interceptor.post(`/api/follow/${userId}`);

            if (userId === "me") {
                const updatedState = {
                    ...user,
                    followers_count: user.isFollowing
                        ? user.followers_count - 1
                        : user.followers_count + 1,
                    isFollowing: !user.isFollowing
                }
                setUser(updatedState);
            } else {
                const updatedState = {
                    ...otherUser,
                    followers_count: otherUser.isFollowing
                        ? otherUser.followers_count - 1
                        : otherUser.followers_count + 1,
                    isFollowing: !otherUser.isFollowing
                }
                setOtherUser(updatedState);
            }

        } catch (error) {
            console.log("Error following user:", error);
            toast.error("Error following user");
        }
    }

    // Create conversation
    const createConversation = async () => {
        try{
            const res = await interceptor.post('/api/chat/conversation', { userId });
            const { conversation } = res.data;
            navigate(`/messages/${conversation._id}`);

        }catch(error){
            console.log("Error creating conversation:", error);
            toast.error("Error creating convo.:", error.response.data.error);
        }
    }

    return (
        <>
            {/* Profile Image & Bio */}
            <section className="mt-12 flex justify-center items-center flex-wrap gap-10 px-4">
                <img src={avatar} alt="Profile" className="w-28 aspect-square object-cover rounded-full" />

                <div className="max-w-2xl space-y-1">
                    {profile_name && (
                        <p className="font-semibold text-lg">{profile_name}</p>
                    )}

                    {(marital_status?.status || gender?.g) && (
                        <p className={`text-sm ${grayText} flex gap-2.5`}>
                            {(marital_status?.status && marital_status?.display_on_profile) ? <span className='flex items-center gap-1'><GiClover /> {marital_status.status}</span> : ""}{" "}
                            {(marital_status?.status && marital_status?.display_on_profile) && (gender?.g && gender?.display_on_profile) && "|"}
                            {gender?.g && gender?.display_on_profile ? <span className='flex items-center gap-1'><BsGenderAmbiguous /> {gender.g}</span> : ""}
                        </p>
                    )}

                    {DOB?.date && DOB?.display_on_profile && <p className={`text-sm ${grayText}`}>
                        DOB: {new Date(DOB.date).toLocaleDateString()}
                    </p>}

                    {bio && (
                        <pre className={`text-sm ${grayText} w-full max-w-xl whitespace-pre-wrap`}>
                            {expandedBio ? bio : `${bio.slice(0, 120)}${bio.length > 120 ? "..." : ""}`}
                            <br />
                            {bio.length > 120 && (
                                <i onClick={() => setExpandedBio(prev => !prev)} className="font-medium cursor-default">
                                    {expandedBio ? "Read less" : "Read more"}
                                </i>
                            )}
                        </pre>
                    )}

                    {/* Website URL */}
                    {profile_website?.website && profile_website?.display_on_profile && (
                        <a
                            href={profile_website?.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm flex gap-2 items-center mt-2 ${grayText} hover:text-blue-500 transition`}
                        >
                            <FaLink /> <span className="pb-1">{profile_website?.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}

                    {/* Social Media Icons */}
                    {social_links.length > 0 && (
                        <div className="flex gap-4 mt-2">
                            {social_links.map(({ platform, link }) => (
                                <a
                                    key={platform}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 text-xl hover:text-blue-500 transition"
                                    aria-label={platform}
                                >
                                    {platformIcons[platform]}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Stats */}
            <section className="flex justify-center items-center gap-24 max-sm:gap-12 mt-8 *:flex *:flex-col *:items-center *:cursor-pointer">
                <div onClick={() => navigate('followers')}>
                    <p className="text-xl font-bold font-mono">{followers_count}</p>
                    <p className={`${grayText} text-sm`}>Followers</p>
                </div>
                <div onClick={() => navigate('following')}>
                    <p className="text-xl font-bold font-mono">{following_count}</p>
                    <p className={`${grayText} text-sm`}>Following</p>
                </div>
                <div>
                    <p className="text-xl font-bold font-mono">{total_posts}</p>
                    <p className={`${grayText} text-sm`}>Posts</p>
                </div>
            </section>

            {/* Action Buttons */}
            {(userId !== "me" && user._id !== otherUser._id) && <section className="flex justify-center items-center gap-16 max-sm:gap-12 mt-8 *:w-32 *:py-2 *:rounded-full *:cursor-pointer">
                <button
                    type='button'
                    onClick={handleFollow}
                    className={`${isFollowing ? grayButtonBg : `text-white ${blueButtonBg}`} transition-colors duration-200`}
                >
                    {isFollowing ? "Following" : "Follow"}
                </button>

                <button
                    type='button'
                    onClick={createConversation}
                    className={`${buttonStyle} text-white transition-colors duration-200`}
                >
                    Message
                </button>
            </section>}
        </>
    )
}
