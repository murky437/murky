import { expect, test, vi } from 'vitest';
import { newTestContainer } from '../src/app/testContainer.ts';
import { App } from '../src/app/app.ts';
import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import { Main } from '../src/components/Main.tsx';

test('Logging in', async () => {
  const c = newTestContainer();
  const app = new App(c);

  const spy = vi.spyOn(c.serverState.auth, 'createTokens');

  render(() => <Main app={app} />);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/login');
  });

  const form = screen.getByTestId('login-form');
  const formQueries = within(form);
  const username = formQueries.getByLabelText('Username');
  const password = formQueries.getByLabelText('Password');
  const button = formQueries.getByRole('button', { name: /log in/i });

  // empty submit
  spy.mockRejectedValue({
    fieldErrors: {
      username: ['Must not be blank.'],
      password: ['Must not be blank.'],
    },
    generalErrors: [],
  });
  fireEvent.submit(form);
  await waitFor(() => {
    expect(username.nextElementSibling?.textContent).toMatch('Must not be blank.');
    expect(password.nextElementSibling?.textContent).toMatch('Must not be blank.');
  });

  // empty submit (click button)
  fireEvent.click(button);
  await waitFor(() => {
    expect(username.nextElementSibling?.textContent).toMatch('Must not be blank.');
    expect(password.nextElementSibling?.textContent).toMatch('Must not be blank.');
  });

  // fill one field
  spy.mockRejectedValue({
    fieldErrors: { password: ['Must not be blank.'] },
    generalErrors: [],
  });
  fireEvent.input(username, { target: { value: 'user' } });
  fireEvent.click(button);
  await waitFor(() => {
    expect(password.nextElementSibling?.textContent).toMatch('Must not be blank.');
  });

  // wrong credentials
  spy.mockRejectedValue({
    fieldErrors: {},
    generalErrors: ['Invalid credentials'],
  });
  fireEvent.input(password, { target: { value: 'wrong' } });
  fireEvent.click(button);
  await waitFor(() => {
    expect(formQueries.getByText('Invalid credentials')).toBeInTheDocument();
  });

  // correct credentials
  spy.mockResolvedValue({ accessToken: 'ok' });
  fireEvent.input(password, { target: { value: 'correct' } });
  fireEvent.click(button);
  await waitFor(() => {
    expect(app.client.auth.isAuthenticated()).toBe(true);
    expect(window.location.pathname).toBe('/notes');
  });

  expect(spy).toHaveBeenNthCalledWith(1, { username: '', password: '' });
  expect(spy).toHaveBeenNthCalledWith(2, { username: '', password: '' });
  expect(spy).toHaveBeenNthCalledWith(3, { username: 'user', password: '' });
  expect(spy).toHaveBeenNthCalledWith(4, { username: 'user', password: 'wrong' });
  expect(spy).toHaveBeenNthCalledWith(5, { username: 'user', password: 'correct' });
});
