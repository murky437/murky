import {type ReactNode, useEffect, useRef} from "react";

interface Props {
    x: number;
    y: number;
    onClose: () => void;
    children: ReactNode;
}

function ContextMenu({x, y, onClose, children}: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={ref}
            style={{position: "absolute", top: y, left: x}}
        >
            {children}
        </div>
    );
}

export {ContextMenu}