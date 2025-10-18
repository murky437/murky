import { useNavigate } from '@solidjs/router';
import { notes } from '../../store/notes.ts';
import { createEffect } from 'solid-js';

function NotesBasePage() {
  const navigate = useNavigate();

  createEffect(() => {
    const projects = notes.getProjects();
    if (projects.length === 0) {
      return;
    }

    const lastViewedProjectSlug = notes.getLastViewedProjectSlug();
    if (lastViewedProjectSlug) {
      const found = projects.find(p => p.slug === lastViewedProjectSlug);

      if (found) {
        navigate(`/notes/${lastViewedProjectSlug}`, { replace: true });
        return;
      }
    }

    navigate(`/notes/${[projects[0].slug]}`, { replace: true });
  });

  return (
    <div>
      <div>base page</div>
    </div>
  );
}

export { NotesBasePage };
