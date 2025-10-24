import { expect, test, vi } from 'vitest';
import { Main } from '../../src/components/Main.tsx';
import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import { newTestContainer } from '../../src/app/testContainer.ts';
import { App } from '../../src/app/app.ts';

test('Create first project through modal', async () => {
  const c = newTestContainer();
  const app = new App(c);
  app.auth.setAccessToken('test-token');

  const spy = vi.spyOn(c.projectsApi, 'create');

  render(() => <Main app={app} />);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/notes');
  });

  const sidebar = screen.getByTestId('sidebar');

  // Cancel button closes the modal
  fireEvent.contextMenu(sidebar);
  fireEvent.click(within(screen.getByTestId('context-menu')).getByRole('button', { name: 'Add' }));
  fireEvent.click(within(screen.getByTestId('modal')).getByRole('button', { name: 'Cancel' }));
  expect(screen.queryByTestId('modal')).toBeNull();

  // Escape key closes the modal
  fireEvent.contextMenu(sidebar);
  fireEvent.click(within(screen.getByTestId('context-menu')).getByRole('button', { name: 'Add' }));
  expect(screen.queryByTestId('add-project-form')).toBeInTheDocument();
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByTestId('add-project-form')).toBeNull();

  // Test form submissions

  fireEvent.click(screen.getByRole('button', { name: 'Add a new project' }));
  const form = screen.getByTestId('add-project-form');
  const formQueries = within(form);
  const title = formQueries.getByPlaceholderText('Title');
  const slug = formQueries.getByPlaceholderText('slug');
  const saveButton = formQueries.getByRole('button', { name: 'Save' });

  // Empty submit
  spy.mockRejectedValue({
    fieldErrors: {
      title: ['Must not be blank.'],
      slug: ['Must not be blank.'],
    },
    generalErrors: [],
  });
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
    { title: 'New Project', slug: 'new-project' },
  ]);
  vi.spyOn(c.projectsApi, 'getNotes').mockResolvedValue('');
  fireEvent.change(title, { target: { value: 'New Project' } });
  fireEvent.change(slug, { target: { value: 'new-project' } });
  fireEvent.click(saveButton);
  await waitFor(() => {
    expect(screen.queryByTestId('add-project-form')).toBeNull();
    expect(window.location.pathname).toBe('/notes');
    expect(within(sidebar).queryByRole('link', { name: 'New Project' })).toBeInTheDocument();
  });

  expect(spy).toHaveBeenNthCalledWith(1, { title: '', slug: '' });
  expect(spy).toHaveBeenNthCalledWith(2, { title: 'asd', slug: 'qwe' });
  expect(spy).toHaveBeenNthCalledWith(3, { title: 'New Project', slug: 'new-project' });
});
