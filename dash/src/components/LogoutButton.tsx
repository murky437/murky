import {useAuth} from "../context/AuthContext.tsx";
import {useRouter} from "@tanstack/react-router";

function LogoutButton() {
    const auth = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        auth.logout().then(() => {
            router.invalidate()
        })
    };

    return <button className="logout-button" onClick={handleLogout}>Logout</button>;
}

export {LogoutButton};