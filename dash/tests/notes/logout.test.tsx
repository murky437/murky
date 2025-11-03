import { expect, test } from 'vitest';
import { Main } from '../../src/components/Main.tsx';
import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import { newTestContainer } from '../../src/app/testContainer.ts';
import { App } from '../../src/app/app.ts';

test('Log out from notes page', async () => {
  const c = newTestContainer();
  c.clientState.auth.setAccessToken('test-token');
  const app = new App(c);

  render(() => <Main app={app} />);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/notes');
  });

  const sidebar = screen.getByTestId('sidebar');

  const menuDiv = within(sidebar).getByText('Settings');
  expect(menuDiv).toBeInTheDocument();

  fireEvent.click(menuDiv);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/settings');
  });

  const logoutButton = screen.getByRole('button', { name: 'Log out' });
  expect(logoutButton).toBeInTheDocument();

  fireEvent.click(logoutButton);

  await waitFor(() => {
    expect(app.client.auth.getAccessToken()).toBeNull();
    expect(window.location.pathname).toBe('/login');
  });
});
