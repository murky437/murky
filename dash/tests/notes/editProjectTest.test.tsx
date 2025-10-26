import { expect, test, vi } from 'vitest';
import { Main } from '../../src/components/Main.tsx';
import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import { newTestContainer } from '../../src/app/testContainer.ts';
import { App } from '../../src/app/app.ts';

test('Edit projects', async () => {
  const c = newTestContainer();
  c.clientState.auth.setAccessToken('test-token');
  const app = new App(c);

  const spy = vi.spyOn(c.projectsApi, 'update');
  vi.spyOn(c.projectsApi, 'getList').mockResolvedValue([
    { title: 'Project-1', slug: 'project-1' },
    { title: 'Project-2', slug: 'project-2' },
    { title: 'Project-3', slug: 'project-3' },
  ]);
  vi.spyOn(c.projectsApi, 'getNotes').mockResolvedValue('');

  render(() => <Main app={app} />);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/notes/project-1');
  });

  const sidebar = screen.getByTestId('sidebar');

  // Cancel button closes the modal
  fireEvent.contextMenu(within(sidebar).getByRole('link', { name: 'Project-1' }));
  fireEvent.click(within(screen.getByTestId('context-menu')).getByRole('button', { name: 'Edit' }));
  fireEvent.click(within(screen.getByTestId('modal')).getByRole('button', { name: 'Cancel' }));
  expect(screen.queryByTestId('modal')).toBeNull();

  // Escape key closes the modal
  fireEvent.contextMenu(within(sidebar).getByRole('link', { name: 'Project-1' }));
  fireEvent.click(within(screen.getByTestId('context-menu')).getByRole('button', { name: 'Edit' }));
  expect(screen.queryByTestId('edit-project-form')).toBeInTheDocument();
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByTestId('edit-project-form')).toBeNull();

  // Test form submissions
  fireEvent.contextMenu(within(sidebar).getByRole('link', { name: 'Project-1' }));
  fireEvent.click(within(screen.getByTestId('context-menu')).getByRole('button', { name: 'Edit' }));
  const form = screen.getByTestId('edit-project-form');
  const formQueries = within(form);
  const title = formQueries.getByPlaceholderText('Title');
  const slug = formQueries.getByPlaceholderText('slug');
  const saveButton = formQueries.getByRole('button', { name: 'Save' });

  expect(title).toHaveValue('Project-1');
  expect(slug).toHaveValue('project-1');

  // Empty submit
  spy.mockRejectedValue({
    fieldErrors: {
      title: ['Must not be blank.'],
      slug: ['Must not be blank.'],
    },
    generalErrors: [],
  });
  fireEvent.change(title, { target: { value: '' } });
  fireEvent.change(slug, { target: { value: '' } });
  fireEvent.submit(form);
  await waitFor(() => {
    expect(title.nextElementSibling?.textContent).toMatch('Must not be blank.');
    expect(slug.nextElementSibling?.textContent).toMatch('Must not be blank.');
  });

  // Unauthorized response
  spy.mockRejectedValue({
    fieldErrors: {},
    generalErrors: ['Unauthorized'],
  });
  fireEvent.change(title, { target: { value: 'asd' } });
  fireEvent.change(slug, { target: { value: 'qwe' } });
  fireEvent.click(saveButton);
  await waitFor(() => {
    expect(formQueries.getByText('Unauthorized')).toBeInTheDocument();
  });

  // Success
  spy.mockResolvedValue(undefined);
  vi.spyOn(c.projectsApi, 'getList').mockResolvedValue([
    { title: 'New title', slug: 'new-slug' },
    { title: 'Project-2', slug: 'project-2' },
    { title: 'Project-3', slug: 'project-3' },
  ]);
  fireEvent.change(title, { target: { value: 'New title' } });
  fireEvent.change(slug, { target: { value: 'new-slug' } });
  fireEvent.click(saveButton);
  await waitFor(() => {
    expect(screen.queryByTestId('edit-project-form')).toBeNull();
    expect(window.location.pathname).toBe('/notes/new-slug');
    expect(within(sidebar).queryByRole('link', { name: 'New title' })).toBeInTheDocument();
  });

  expect(spy).toHaveBeenNthCalledWith(1, 'project-1', { title: '', slug: '' });
  expect(spy).toHaveBeenNthCalledWith(2, 'project-1', { title: 'asd', slug: 'qwe' });
  expect(spy).toHaveBeenNthCalledWith(3, 'project-1', { title: 'New title', slug: 'new-slug' });
});
