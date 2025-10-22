import { type State, StateService } from './state/state.ts';
import { AuthService } from './auth/authService.ts';
import { NotesService } from './notes/notesService.ts';
import type { Container } from './container.ts';

class App {
  readonly #state: State;
  readonly #stateService: StateService;
  readonly auth: AuthService;
  readonly notes: NotesService;

  constructor(c: Container) {
    this.#state = c.state;
    this.#stateService = c.stateService;
    this.auth = c.authService;
    this.notes = c.notesService;
  }

  resetState() {
    this.#stateService.resetState(this.#state);
  }
}

export { App };
