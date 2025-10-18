import { Sidebar } from '../../Sidebar.tsx';
import type { RouteSectionProps } from '@solidjs/router';

function NotesLayout(props: RouteSectionProps) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      {props.children}
    </div>
  );
}

export { NotesLayout };
