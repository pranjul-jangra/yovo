import { useNavigate } from "react-router-dom";
import useThemeStyles from "../hooks/useThemeStyles";

export default function UserCard({ user }) {
    const { border, grayText } = useThemeStyles();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/profile/${user._id}`);
    };

    return (
        <div className={`flex items-center p-3 min-w-48 rounded-xl border ${border} cursor-pointer transition`} onClick={handleClick}>
            <img src={user?.avatar || "/user.png"} alt={user?.username} className="w-10 h-10 rounded-full object-cover mr-3"/>
            
            <div className="flex flex-col">
                <span>{user?.username}</span>
                <span className={`text-[0.8rem] ${grayText}`}>{user?.profile_name || ""}</span>
            </div>
        </div>
    );
}
