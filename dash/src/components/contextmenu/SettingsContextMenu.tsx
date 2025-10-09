import {ContextMenu} from "./ContextMenu.tsx";
import {useAuth} from "../../context/AuthContext.tsx";
import {useRouter} from "@tanstack/react-router";
import {useLayoutEffect, useState} from "react";

interface Props {
    x: number;
    y: number;
    onClose: () => void;
}

function SettingsContextMenu({x, y, onClose}: Props) {
    const auth = useAuth()
    const router = useRouter()
    const [pos, setPos] = useState({x, y});

    useLayoutEffect(() => {
        const menuHeight = 24;
        const adjustedY = y - menuHeight < 0 ? y : y - menuHeight;
        setPos({x, y: adjustedY});
    }, [x, y]);

    const handleLogout = () => {
        auth.logout().then(() => {
            router.invalidate()
        })
    };
    return (
        <ContextMenu x={pos.x} y={pos.y} onClose={onClose}>
            <button onClick={handleLogout}>Logout</button>
        </ContextMenu>
    );
}

export {SettingsContextMenu}