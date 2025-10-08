import {useAuth} from "../context/AuthContext.tsx";
import {useRouter} from "@tanstack/react-router";
import styles from './LogoutButton.module.css'

function LogoutButton() {
    const auth = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        auth.logout().then(() => {
            router.invalidate()
        })
    };

    return <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>;
}

export {LogoutButton};