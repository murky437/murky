import { ContextMenu } from './ContextMenu.tsx';
import type { Component } from 'solid-js';

interface Props {
  x: number;
  y: number;
  onClose: () => void;
  onEdit: () => void;
}

const ProjectContextMenu: Component<Props> = props => {
  return (
    <ContextMenu x={props.x} y={props.y} onClose={props.onClose}>
      <button onClick={props.onEdit}>Edit</button>
    </ContextMenu>
  );
};

export { ProjectContextMenu };
