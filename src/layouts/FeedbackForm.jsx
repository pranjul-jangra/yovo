import { useState } from "react";
import { toast } from 'sonner';
import useThemeStyles from "../hooks/useThemeStyles";
import { feedbackCategories } from "../utils/feedbackCategories";
import useLoaderStore from "../store/loaderStore";
import interceptor from "../middleware/axiosInterceptor";


export default function FeedbackForm() {
    const { bgColor, grayText, modalsBg, shadow, border, buttonStyle } = useThemeStyles();
    const { setScreenLoader } = useLoaderStore();

    const [form, setForm] = useState({ name: "", email: "", category: "", subject: "", message: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) return toast.error("Please fill in all required fields.");
        setScreenLoader(true);

        try {
            await interceptor.post('/api/auth/submit-feedback', form);

            setForm({ name: "", email: "", category: "", subject: "", message: "" });
            toast.success(
                <div>
                    <h1>Thank you! Your message was sent.</h1>
                    <p style={{ fontSize: "0.9em" }}>We’ll contact you via email soon.</p>
                </div>
            );

        } catch (error) {
            console.log("Error submitting feedback:", error);
            toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
        }finally{
            setScreenLoader(false);
        }
    };


    return (
        <main className={`min-h-screen flex items-center justify-center ${bgColor} px-4`}>
            <div className={`max-w-2xl mx-auto ${modalsBg} rounded-3xl shadow-md ${shadow} border ${border} p-8`}>
                <h2 className="text-2xl font-bold mb-2">We’d love your feedback</h2>
                <p className={`text-sm mb-6 ${grayText}`}>Share your thoughts, report an issue, or suggest an improvement.</p>

                <form onSubmit={handleSubmit} className={`max-w-2xl space-y-5 w-full`}>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input
                            name="name"
                            type="text"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-xl ${border}`}
                            aria-label="Name"
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-xl ${border}`}
                            aria-label="Email"
                        />
                    </div>

                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-xl ${border}`}
                        aria-label="Category"
                    >
                        <option value="" className="text-black">Select a category (optional)</option>
                        {feedbackCategories.map((cat) => (
                            <option key={cat} value={cat} className="text-black">
                                {cat}
                            </option>
                        ))}
                    </select>

                    <input
                        name="subject"
                        type="text"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-xl ${border}`}
                        aria-label="Subject"
                    />

                    <textarea
                        name="message"
                        rows={5}
                        placeholder="Write your message here..."
                        value={form.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-xl ${border}`}
                        aria-label="Message"
                    />

                    <button type="submit" className={`w-full ${buttonStyle} text-white text-md font-medium py-2 px-4 rounded-xl transition`} aria-label="Submit Feedback">
                        Submit Feedback
                    </button>
                </form>
            </div>
        </main>
    );
}
