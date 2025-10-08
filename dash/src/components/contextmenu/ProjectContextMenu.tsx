import {ContextMenu} from "./ContextMenu.tsx";

interface Props {
    x: number;
    y: number;
    onClose: () => void;
    onEdit: () => void;
}

function ProjectContextMenu({x, y, onClose, onEdit}: Props) {
    return (
        <ContextMenu x={x} y={y} onClose={onClose}>
            <button onClick={onEdit}>Edit</button>
        </ContextMenu>
    );
}

export {ProjectContextMenu}