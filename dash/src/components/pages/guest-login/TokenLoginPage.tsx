import { type Component, createEffect, For, Show } from 'solid-js';
import styles from './TokenLoginPage.module.css';
import { useApp } from '../../../app/appContext.tsx';
import { Spinner } from '../../shared/Spinner.tsx';
import {A, useParams } from '@solidjs/router';
import { createMutable } from 'solid-js/store';
import { isGeneralError } from '../../../app/api/api.ts';

const TokenLoginPage: Component = () => {
  const app = useApp();
  const params = useParams();
  const state = createMutable({
    generalErrors: [] as string[],
  });

  createEffect(async () => {
    if (params.token) {
      try {
        const response = await app.server.auth.createTokenWithGuestToken({
          guestToken: params.token,
        });
        app.client.auth.setAccessToken(response.accessToken);
        state.generalErrors = [];
      } catch (err) {
        if (isGeneralError(err)) {
          state.generalErrors = [err.message];
        } else {
          state.generalErrors = ['Unknown error'];
        }
      }
    }
  });

  return (
    <div class={styles.tokenLoginPage}>
      <div class={styles.center}>
        <For each={state.generalErrors}>
          {item => <div class={styles.generalError}>{item}</div>}
        </For>
        <Show when={state.generalErrors}>
          <div class={styles.backLink}><A href={'/guest-login'}>Go back to guest login.</A></div>
        </Show>
        <Show when={!state.generalErrors}>
          <div>Logging you in <Spinner class={styles.spinner}/></div>
        </Show>
      </div>
    </div>
  );
};

export { TokenLoginPage };
