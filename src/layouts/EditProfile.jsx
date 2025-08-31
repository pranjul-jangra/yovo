import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import useThemeStyles from '../hooks/useThemeStyles';
import { MdAddAPhoto, MdDelete, MdCameraAlt, MdUpload, MdClose } from "react-icons/md";
import { RenderLabeledInput, RenderDropdownWithSwitchButton } from '../ui/RenderInputs';
import { platformOptions, platformIcons } from '../utils/socialMediaPlatformOptions';
import useAuthStore from '../store/authStore';
import interceptor from '../middleware/axiosInterceptor';
import Loader from '../components/Loader';


export default function EditProfile() {
    const { bgColor, border, modalsBg, shadow, buttonStyle, grayText, tagsBg } = useThemeStyles();
    const { user, setUser } = useAuthStore();

    // Components state
    const [showModal, setShowModal] = useState(false);
    const [avatarLoader, setAvatarLoader] = useState(false);
    const [profileLoader, setProfileLoader] = useState(false);
    const fileInputRef = useRef(null);
    const captureInputRef = useRef(null);

    const [newPlatform, setNewPlatform] = useState('');
    const [newLink, setNewLink] = useState('');
    const [userData, setUserData] = useState((user?.username && user?.email)
        ? {
            avatar: user?.avatar || '/user.png',
            username: user?.username || '',
            email: user?.email || '',
            profileName: user?.profile_name || '',
            profileWebsite: user?.profile_website?.website || '',
            showWebsite: user?.profile_website?.display_on_profile ?? true,
            bio: user?.bio || '',
            dob: user?.DOB?.date || '',
            showDob: user?.DOB?.display_on_profile ?? true,
            maritalStatus: user?.marital_status?.status || '',
            showMaritalStatus: user?.marital_status?.display_on_profile ?? true,
            gender: user?.gender?.g || '',
            showGender: user?.gender?.display_on_profile ?? true,
            socialLink: user?.social_links || [],
        } : null
    );

    // Fetch user if not present already
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await interceptor.get("/api/profile/me");
                const data = res.data?.user;

                setUser(data);

                setUserData({
                    avatar: data?.avatar || '/user.png',
                    username: data?.username || '',
                    email: data?.email || '',
                    profileName: data?.profile_name || '',
                    profileWebsite: data?.profile_website?.website || '',
                    showWebsite: data?.profile_website?.display_on_profile ?? true,
                    bio: data?.bio || '',
                    dob: data?.DOB?.date || '',
                    showDob: data?.DOB?.display_on_profile ?? true,
                    maritalStatus: data?.marital_status?.status || '',
                    showMaritalStatus: data?.marital_status?.display_on_profile ?? true,
                    gender: data?.gender?.g || '',
                    showGender: data?.gender?.display_on_profile ?? true,
                    socialLink: data?.social_links || [],
                });
            } catch (error) {
                toast.error("Failed to load profile.");
                console.error("Error fetching profile", error);
            }
        };

        if (!user || !user.username || !user.email) fetchUserProfile();
    }, [user]);

    // Input change handler
    const handleChange = useCallback((e) => {
        const { value, name } = e.target;
        if (name === "username") {
            setUserData(prev => ({ ...prev, [name]: value.toLowerCase() }));
        }else{
            setUserData(prev => ({ ...prev, [name]: value }));
        }
    }, []);

    const onSwitch = useCallback((e) => {
        const name = e.target.name;
        setUserData(prev => ({ ...prev, [name]: !prev[name] }));
    }, []);

    // Upload or remove avatar
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        setAvatarLoader(true);
        setShowModal(false);
        try {
            const res = await interceptor.patch("/api/profile/update-avatar", formData);
            setUserData(prev => ({ ...prev, avatar: res.data?.avatar }));
            setUser({ ...user, avatar: res.data?.avatar });
            toast.success("Avatar updated!");

        } catch (err) {
            toast.error("Avatar upload failed.");
        } finally {
            e.target.value = '';
            setAvatarLoader(false);
        }
    };

    const removeAvatar = async () => {
        setAvatarLoader(true);
        setShowModal(false);
        try {
            await interceptor.patch("/api/profile/update-avatar", { removeAvatar: true });
            setUserData(prev => ({ ...prev, avatar: '/user.png' }));
            setUser({ ...user, avatar: '/user.png' });
            toast.success("Avatar removed.");

        } catch (err) {
            toast.error("Failed to remove avatar.");
            console.error(err);
        } finally {
            setAvatarLoader(false);
        }
    };

    // Social link handlers
    const addSocialLink = () => {
        // Validating platform and links
        if (!newPlatform) return toast.error("Choose a platform.");
        if (userData?.socialLink?.some(obj => obj.platform === newPlatform)) return toast.error("Duplicate platform.");
        if (!newLink) return toast.error("Enter the link.");
        if (
            !newLink?.trim()?.startsWith('http') ||
            !newLink?.includes('.') ||
            !newLink?.includes('/') ||
            !newLink?.includes(':')
        ) return toast.error("Invalid link format.");

        // Adding link
        setUserData(prev => ({
            ...prev,
            socialLink: [...prev.socialLink, { platform: newPlatform, link: newLink.trim() }]
        }));

        setNewPlatform('');
        setNewLink('');
    };

    const removeSocialLink = (index) => {
        setUserData(prev => {
            const updated = [...prev.socialLink];
            updated.splice(index, 1);
            return { ...prev, socialLink: updated };
        });
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!userData.username) return toast.error("Username is required.");
        if(!userData.email) return toast.error("Email is missing.");
        setProfileLoader(true);

        const payload = {
            username: userData.username,
            email: userData.email,
            profile_name: userData.profileName,
            profile_website: {
                website: userData.profileWebsite,
                display_on_profile: userData.showWebsite,
            },
            bio: userData.bio,
            DOB: {
                date: userData.dob,
                display_on_profile: userData.showDob,
            },
            marital_status: {
                status: userData.maritalStatus,
                display_on_profile: userData.showMaritalStatus,
            },
            gender: {
                g: userData.gender,
                display_on_profile: userData.showGender,
            },
            social_links: userData.socialLink,
        };

        try {
            const res = await interceptor.patch("/api/profile/update-profile", payload);
            setUser(res.data?.user);
            toast.success("Profile updated successfully!");

        } catch (err) {
            toast.error("Failed to update profile.");
            console.error(err);
        } finally {
            setProfileLoader(false);
        }
    };


    return (
        <main className={`min-h-screen flex items-center justify-center ${bgColor} px-4 py-10`}>
            {profileLoader && <div className='fixed inset-0 w-screen h-dvh z-50'><Loader /></div>}


            <div className={`max-w-2xl w-full ${modalsBg} rounded-3xl shadow-md ${shadow} border ${border} p-8`}>
                <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>

                {/* Profile image */}
                <div className='w-32 h-32 relative rounded-full overflow-hidden mb-4 mx-auto' style={{ clipPath: 'circle(50% at 50% 50%)' }}>
                    <img src={userData?.avatar || "/user.png"} alt="" className='absolute inset-0 w-full aspect-square object-cover' />
                    <button type='button' onClick={() => setShowModal(true)} className='absolute top-24 mx-auto w-full backdrop-blur-[3px]'>
                        <MdAddAPhoto className='mx-auto mb-7 mt-1.5 text-xl text-blue-600' />
                    </button>
                    {avatarLoader && <Loader />}
                </div>

                <form onSubmit={handleSubmit}>
                    <RenderLabeledInput value={userData?.username} onChange={handleChange} inputName="username" label="Username" placeholder="Your username" />

                    <RenderLabeledInput value={userData?.email} onChange={handleChange} inputName="email" label="Email" placeholder="Email" isDisabled={true} />

                    <RenderLabeledInput value={userData?.profileName} onChange={handleChange} inputName="profileName" label="Profile name" placeholder="Profile name" />

                    <RenderLabeledInput value={userData?.profileWebsite} onChange={handleChange} inputName="profileWebsite" label="Profile Website" placeholder="Website link" switchValue={userData?.showWebsite} onSwitch={onSwitch} switchName="showWebsite" type='url' />

                    <div className="mb-4">
                        <label htmlFor="bio" className={`block text-sm font-medium ${grayText} mb-2`}>Bio</label>
                        <textarea id="bio" name="bio" rows="4" placeholder="Tell us about yourself" value={userData?.bio} onChange={handleChange} className={`block w-full px-4 py-2 border rounded-xl resize-none focus:ring-blue-500 focus:border-blue-500 ${border}`} data-lenis-prevent />
                    </div>

                    <RenderLabeledInput value={userData?.dob} onChange={handleChange} inputName="dob" label="Date of Birth" placeholder="YYYY-MM-DD" switchValue={userData?.showDob} onSwitch={onSwitch} switchName="showDob" type="date" />

                    <RenderDropdownWithSwitchButton value={userData?.maritalStatus} onChange={handleChange} inputName="maritalStatus" label="Marital Status" options={['Single', 'Married', 'In Relation', 'Divorced', 'Widowed', 'Separated']} switchValue={userData?.showMaritalStatus} onSwitch={onSwitch} switchName="showMaritalStatus" />

                    <RenderDropdownWithSwitchButton value={userData?.gender} onChange={handleChange} inputName="gender" label="Gender" options={['Male', 'Female', 'Non-binary', 'Transgender', 'Prefer not to say', 'Other']} switchValue={userData?.showGender} onSwitch={onSwitch} switchName="showGender" />

                    {/* Social Links */}
                    <div className="mb-6">
                        <label className={`block text-sm font-medium ${grayText} mb-2`}>Social Links</label>

                        {/* Existing social links */}
                        {userData?.socialLink?.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {userData?.socialLink?.map((item, index) => (
                                    <div key={index} className={`flex items-center justify-between py-2 pl-4 pr-2 rounded-xl ${tagsBg} shadow-sm ${shadow}`}>
                                        <div className="flex items-center gap-3">
                                            {platformIcons[item?.platform] || platformIcons?.Other}
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline break-all">
                                                {item.link}
                                            </a>
                                        </div>
                                        <button type="button" onClick={() => removeSocialLink(index)} className={`text-red-500 text-xl font-semibold px-1`}>
                                            <MdClose />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New platform/link form */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className={`flex-1 px-4 py-2 max-w-full md:max-w-36 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-transparent ${border}`}>
                                <option value="" className={`${grayText}`}>Select Platform</option>
                                {platformOptions.map(p => <option key={p} value={p} className='text-black'>{p}</option>)}
                            </select>

                            <input type="url" value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder="https://yourprofile.com" className={`flex-[2] px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 ${border}`} />

                            <button type="button" onClick={addSocialLink} className={`text-white px-4 py-2 rounded-xl ${buttonStyle} whitespace-nowrap`}>
                                Add
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={profileLoader} className={`w-full py-2 px-4 text-white rounded-xl ${buttonStyle} transition duration-200 cursor-pointer`}>
                        Update Profile
                    </button>
                </form>
            </div>


            {/* Modal for profile photo selection */}
            <AnimatePresence>
                {
                    showModal && <motion.div
                        data-lenis-prevent
                        initial={{ backgroundColor: 'rgba(0, 0, 0, 0.01)' }}
                        animate={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                        exit={{ backgroundColor: 'rgba(0, 0, 0, 0.01)' }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ translateY: "100%", opacity: 0 }}
                            animate={{ translateY: 0, opacity: 1 }}
                            exit={{ translateY: "100%", opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${bgColor} rounded-t-3xl shadow-sm pb-4 pt-6 px-6 w-fit ${shadow}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="space-y-3">
                                {userData.avatar !== '/user.png' && (
                                    <button onClick={removeAvatar} className="flex items-center gap-2 w-full text-red-600 hover:underline">
                                        <MdDelete size={20} /> Remove Current Photo
                                    </button>
                                )}

                                <button onClick={() => captureInputRef.current.click()} className="flex items-center gap-2 w-full hover:underline">
                                    <MdCameraAlt size={20} /> Take Photo
                                </button>

                                <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 w-full hover:underline">
                                    <MdUpload size={20} /> Choose from Device
                                </button>
                            </div>
                        </motion.div>

                    </motion.div>
                }

                {/* Hidden Inputs */}
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                <input type="file" accept="image/*" capture="user" ref={captureInputRef} className="hidden" onChange={handleFileChange} />
            </AnimatePresence>
        </main>
    );
}
