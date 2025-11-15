import { expect, test, vi } from 'vitest';
import { Main } from '../../src/components/Main.tsx';
import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import { newTestContainer } from '../../src/app/testContainer.ts';
import { App } from '../../src/app/app.ts';

test('Delete project', async () => {
  const c = newTestContainer();
  c.clientState.auth.setAccessToken('test-token');
  const app = new App(c);

  const spy = vi.spyOn(c.projectsApi, 'delete');
  vi.spyOn(c.projectsApi, 'getList').mockResolvedValue([
    { title: 'Project-1', slug: 'project-1' },
    { title: 'Project-2', slug: 'project-2' },
    { title: 'Project-3', slug: 'project-3' },
  ]);
  vi.spyOn(c.projectsApi, 'getNotes').mockResolvedValue('');
  vi.spyOn(window, 'confirm').mockReturnValue(true);

  render(() => <Main app={app} />);

  app.navigate('/notes');

  await waitFor(() => {
    expect(window.location.pathname).toBe('/notes/project-1');
  });

  const sidebar = screen.getByTestId('sidebar');

  vi.spyOn(c.projectsApi, 'getList').mockResolvedValue([
    { title: 'Project-2', slug: 'project-2' },
    { title: 'Project-3', slug: 'project-3' },
  ]);

  fireEvent.contextMenu(within(sidebar).getByRole('link', { name: 'Project-1' }));
  fireEvent.click(within(screen.getByTestId('context-menu')).getByRole('button', { name: 'Edit' }));
  fireEvent.click(within(screen.getByTestId('modal')).getByRole('button', { name: 'Delete' }));
  expect(window.confirm).toHaveBeenCalled();

  await waitFor(() => {
    expect(screen.queryByTestId('modal')).toBeNull();
    expect(screen.queryByTestId('edit-project-form')).toBeNull();
    expect(window.location.pathname).toBe('/notes/project-2');
  });

  expect(spy).toHaveBeenNthCalledWith(1, 'project-1');
});
