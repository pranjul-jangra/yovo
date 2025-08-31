import useThemeStyles from '../../hooks/useThemeStyles'
import ProfileInfoSkeleton from './ProfileInfoSkeleton'
import ProfilePostsSkeleton from './ProfilePostsSkeleton'

export default function ProfileSkeleton() {
    const { bgColor, border } = useThemeStyles();

    return (
        <section className={`overflow-y-auto w-full ${bgColor} p-4`}>
            <div>
                {/* Top heading and edit icon */}
                <div className="flex items-center justify-between">
                    <div className="h-6 w-32 rounded-md bg-gray-300 animate-pulse" />
                    <div className={`border ${border} px-2 py-2 rounded-full`}>
                        <div className="h-5 w-5 rounded-full bg-gray-300 animate-pulse" />
                    </div>
                </div>

                {/* ProfileInfo + Posts Skeletons */}
                <ProfileInfoSkeleton />
                <ProfilePostsSkeleton />
            </div>
        </section>
    )
}
