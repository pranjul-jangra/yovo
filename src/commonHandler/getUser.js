import interceptor from "../middleware/axiosInterceptor"

export const getUser = async () => {
    try {
        const res = await interceptor.get(`/api/profile/me`);
        return res.data?.user;

    } catch (error) {
        console.log("Error getting user:", error);
        return null;
    }
}