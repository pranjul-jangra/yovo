import { useState } from 'react';
import useThemeStyles from '../hooks/useThemeStyles';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function MediaUploader() {
    const { bgColor, border, modalsBg, shadow, grayText, blueButtonBg } = useThemeStyles();
    const [files, setFiles] = useState([]);
    const [mediaType, setMediaType] = useState(null);
    const navigate = useNavigate();

    // Image input handler
    const handleImageChange = (e) => {
        const selected = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
        if (selected.length === 0) return toast.error('Please select at least one image.');

        setFiles(selected);
        setMediaType('image');
    };

    // Video input handler
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('video/')) return toast.error('Please select a valid video file.');
        if(file?.size > 20971520){
            setFiles([]);
            toast.error("File size should be under 20 mb.");
            e.target.value = null;
            return;
        }

        setFiles([file]);
        setMediaType('video');
    };

    // Navigate to composer component and passing the media
    const handleNext = () => {
        if (!files.length) {
            toast.error('Please select media before continuing.');
            return;
        }

        const payload = {
            mediaFiles: files,
            mediaType
        };

        // Send data to composer page 
        navigate('/home/create/compose', { state: payload });
    };

    return (
        <main className={`w-screen min-h-dvh flex justify-center items-center px-4 py-10 ${bgColor}`}>
            <div className={`p-6 border ${border} rounded-3xl w-full max-w-3xl space-y-6 ${modalsBg} shadow-md ${shadow}`}>
                <h2 className="text-2xl font-semibold text-center">Upload Media</h2>

                <div className="space-y-2">
                    <label htmlFor='image-upload' className="block text-lg font-medium">Upload Images</label>
                    <p className={`text-sm ${grayText}`}>Choose one or more images for your post.</p>
                    <input
                        id='image-upload'
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <div className='relative py-4'>
                    <hr className={`border ${border} absolute w-full top-1/2 -translate-y-1/2`} />
                    <span className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ${modalsBg} ${grayText} px-2`}>Or</span>
                </div>

                <div className="space-y-2">
                    <label htmlFor='video-upload' className="block text-lg font-medium">Upload Video</label>
                    <p className={`text-sm ${grayText}`}>Upload a single video for your post.</p>
                    <input
                        id='video-upload'
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                </div>

                {files.length > 0 && (
                    <button onClick={handleNext} className={`w-full py-2 ${blueButtonBg} text-white rounded-xl font-semibold`}>
                        Next
                    </button>
                )}
            </div>
        </main>
    );
}
