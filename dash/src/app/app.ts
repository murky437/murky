import { type State, StateService } from './state/state.ts';
import { AuthService } from './auth/authService.ts';
import { NotesService } from './notes/notesService.ts';
import type { Container } from './container.ts';
import type { StatusService } from './status/statusService.ts';

class App {
  readonly #state: State;
  readonly #stateService: StateService;
  readonly auth: AuthService;
  readonly notes: NotesService;
  readonly status: StatusService;

  constructor(c: Container) {
    this.#state = c.state;
    this.#stateService = c.stateService;
    this.auth = c.authService;
    this.notes = c.notesService;
    this.status = c.statusService;
    this.status.loadDeployStatus().then();
  }

  resetState() {
    this.#stateService.resetState(this.#state);
    this.status.loadDeployStatus().then();
  }
}

export { App };
