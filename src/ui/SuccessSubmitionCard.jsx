import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { Link } from 'react-router-dom';
import useThemeStyles from '../hooks/useThemeStyles'

export default function SuccessSubmitionCard({ message = "Your request is completed successfully." }) {
    const { successSubmitionBg, greenButtonStyle, greenBorder } = useThemeStyles();

    return (
        <div className={`p-6 border ${greenBorder} rounded-xl text-green-600 ${successSubmitionBg} flex items-center gap-2 flex-col`}>
            <IoMdCheckmarkCircleOutline className='text-7xl' />
            <p className='text-center'>{message}</p>

            <Link to={'/'} replace className={`border ${greenBorder} ${greenButtonStyle} px-4 py-2 rounded-xl mt-4`}>Back to home</Link>
        </div>
    )
}
