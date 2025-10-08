import {ContextMenu} from "./ContextMenu.tsx";

interface Props {
    x: number;
    y: number;
    onClose: () => void;
    onAdd: () => void;
}

function SidebarContextMenu({x, y, onClose, onAdd}: Props) {
    return (
        <ContextMenu x={x} y={y} onClose={onClose}>
            <button onClick={onAdd}>Add</button>
        </ContextMenu>
    );
}

export {SidebarContextMenu}