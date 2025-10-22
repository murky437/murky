import { expect, test, vi } from 'vitest';
import { Main } from '../src/app/Main.tsx';
import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { newTestContainer } from '../src/app/testContainer.ts';
import { App } from '../src/app/app.ts';

test('Redirect to login when logout button is clicked', async () => {
  const c = newTestContainer();
  vi.spyOn(c.authApi, 'deleteRefreshToken').mockResolvedValue(undefined);
  vi.spyOn(c.projectsApi, 'getList').mockResolvedValue([{ title: 'Project 1', slug: 'project-1' }]);

  const app = new App(c);
  app.auth.setAccessToken('test-token');

  render(() => <Main app={app} />);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/notes/project-1');
  });

  // // mock logout + navigation
  // vi.spyOn(container.authApi, 'logout').mockResolvedValue({});
  // container.authState.setAccessToken('token'); // make logged in

  // // simulate clicking logout
  // const logoutButton = await screen.findByRole('button', { name: /logout/i });
  // fireEvent.click(logoutButton);

  // // expect logout and redirect to login page
  // expect(container.authApi.logout).toHaveBeenCalled();

  const menuDiv = await screen.findByText('☰');
  expect(menuDiv).toBeInTheDocument();

  fireEvent.click(menuDiv);

  const logoutButton = await screen.getByRole('button', { name: 'Logout' });
  expect(logoutButton).toBeInTheDocument();

  fireEvent.click(logoutButton);

  await waitFor(() => expect(app.auth.getAccessToken()).toBeNull());

  await waitFor(() => {
    expect(window.location.pathname).toBe('/login');
  });
});
