export function Switch({ checked, onCheckedChange }) {
    const switchColor = checked ? "bg-blue-600" : "bg-gray-300";
    const sliderBg = checked ? "bg-white" : "bg-blue-600";
    const translate = checked ? "translate-x-6" : "translate-x-0";

    return (
        <button
            onClick={onCheckedChange}
            className={`w-12 h-6 flex items-center rounded-full px-1 transition-colors duration-200 ${switchColor}`}
        >
            <div className={`w-4 h-4 ${sliderBg} rounded-full shadow transform transition-transform duration-200 ${translate}`} />
        </button>
    )
}