import { IoMdAdd } from "react-icons/io";
import useThemeStyles from "../hooks/useThemeStyles";


export default function Stories() {
    const { grayText } = useThemeStyles();

    return (
        <section className='h-fit px-2 py-2 flex flex-nowrap gap-6 overflow-x-auto *:shrink-0 *:max-w-14'>
            {/* Your story */}
            <div className="group">
                <div className="w-14 aspect-square relative">
                    <img src="/dummy1.jpeg" className='absolute w-14 aspect-square object-cover rounded-full shrink-0' alt="" />
                    <button type="button" aria-label="Add Story" className="w-full h-full bg-gray-900/80 text-white opacity-0 group-hover:opacity-100 rounded-full absolute z-10 flex justify-center items-center transition-opacity duration-150">
                        <IoMdAdd className="text-3xl" />
                    </button>
                </div>
                <p className={`whitespace-nowrap truncate text-[12px] text-center mt-1 ${grayText} font-semibold`}>You</p>
            </div>

            {
                new Array(20).fill(0).map((s, i) => (
                    <div>
                        <img src="/user.png" className='w-14 aspect-square object-cover rounded-full shrink-0' alt="" />
                        <p className={`whitespace-nowrap truncate text-[12px] text-center mt-1 ${grayText} font-semibold`}>User-{i + 1}</p>
                    </div>
                ))
            }

        </section>
    )
}
