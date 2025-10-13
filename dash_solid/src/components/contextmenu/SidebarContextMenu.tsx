import { ContextMenu } from './ContextMenu.tsx';
import type { Component } from 'solid-js';

interface Props {
  x: number;
  y: number;
  onClose: () => void;
  onAdd: () => void;
}

const SidebarContextMenu: Component<Props> = props => {
  return (
    <ContextMenu x={props.x} y={props.y} onClose={props.onClose}>
      <button onClick={props.onAdd}>Add</button>
    </ContextMenu>
  );
};

export { SidebarContextMenu };
