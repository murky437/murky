import { expect, test } from 'vitest';
import { Main } from '../../src/app/Main.tsx';
import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import { newTestContainer } from '../../src/app/testContainer.ts';
import { App } from '../../src/app/app.ts';

test('Log out from notes page', async () => {
  const c = newTestContainer();
  const app = new App(c);
  app.auth.setAccessToken('test-token');

  render(() => <Main app={app} />);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/notes');
  });

  const sidebar = screen.getByTestId('sidebar');

  const menuDiv = within(sidebar).getByText('☰');
  expect(menuDiv).toBeInTheDocument();

  fireEvent.click(menuDiv);

  const contextMenu = screen.getByTestId('context-menu');
  const logoutButton = within(contextMenu).getByRole('button', { name: 'Log out' });
  expect(logoutButton).toBeInTheDocument();

  fireEvent.click(logoutButton);

  await waitFor(() => {
    expect(app.auth.getAccessToken()).toBeNull();
    expect(window.location.pathname).toBe('/login');
  });
});
