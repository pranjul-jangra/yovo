import { useState } from 'react';
import useThemeStyles from '../hooks/useThemeStyles';
import { useLocation } from "react-router-dom";
import { toast } from 'sonner';
import { FaFlag } from 'react-icons/fa';
import { reportReasons } from '../utils/reportReasons';
import SuccessSubmitionCard from '../ui/SuccessSubmitionCard';
import interceptor from '../middleware/axiosInterceptor';


export default function Report() {
    const location = useLocation();
    const { reportType, targetId } = location.state || {};
    const { bgColor, grayText, border, modalsBg, buttonStyle } = useThemeStyles();

    const [selectedReason, setSelectedReason] = useState("");
    const [details, setDetails] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Submit handler
    async function handleSubmit(e) {
        e.preventDefault();
        if(submitting) return;
        if (!selectedReason) return toast.error("Please select a reason to report.");
        setSubmitting(true);

        try {
            await interceptor.post("/api/report", { type: reportType, targetId, reason: selectedReason, details });
            setSelectedReason("");
            setDetails("");
            setSubmitted(true);

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to submit report.');
        } finally {
            setSubmitting(false);
        }
    }


    return (
        <main className={`min-h-dvh ${bgColor} px-4 py-10 flex justify-center`}>
            <div className="w-full max-w-xl">
                <h1 className="text-2xl font-bold mb-3 flex items-center gap-2"><FaFlag className="text-red-500" /> Report Content</h1>
                <p className={`${grayText} text-sm mb-6`}>Please select the reason you're reporting this content. All reports are confidential.</p>

                {
                    submitted
                        ? <SuccessSubmitionCard message='Your report has been submitted. Thank you for helping us keep the community safe.' />
                        : <form onSubmit={handleSubmit} className={`space-y-5 border rounded-xl p-5 ${border} ${modalsBg}`}>
                            <div>
                                <strong className="block mb-2 font-medium text-sm">Reason for reporting:</strong>
                                <div className="grid gap-2">
                                    {reportReasons.map((reason, idx) => (
                                        <label
                                            htmlFor={`reason-${idx}`}
                                            key={idx}
                                            className={`flex items-center gap-2 text-sm p-2 rounded-lg border ${selectedReason === reason ? 'border-red-400 bg-red-100/40 dark:bg-red-900/20' : border} cursor-pointer`}
                                        >
                                            <input
                                                id={`reason-${idx}`}
                                                type="radio"
                                                name="reportReason"
                                                value={reason}
                                                checked={selectedReason === reason}
                                                onChange={() => setSelectedReason(reason)}
                                                className="accent-red-500"
                                            />
                                            {reason}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor='details' className="block mb-2 font-medium text-sm">Additional details (optional):</label>
                                <textarea
                                    id="details"
                                    rows="4"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="Provide more information if needed..."
                                    className={`w-full p-2 rounded-lg border ${border} bg-transparent resize-none text-sm`}
                                />
                            </div>

                            <button type="submit" disabled={submitting} className={`${buttonStyle} text-white rounded-xl w-full py-2 ${submitting ? "opacity-45" : ""}`}>{submitting ? "Submitting..." : "Submit Report"}</button>
                        </form>
                }
            </div>
        </main>
    );
}
