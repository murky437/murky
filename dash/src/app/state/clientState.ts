import { StatusState } from '../domain/status/state.ts';
import { AuthState } from '../domain/auth/state.ts';
import { NotesState } from '../domain/notes/state.ts';

class ClientState {
  readonly auth: AuthState;
  readonly notes: NotesState;
  readonly status: StatusState;

  constructor(storage: Storage) {
    this.auth = new AuthState(storage);
    this.notes = new NotesState(storage);
    this.status = new StatusState();
  }

  reset(): void {
    this.auth.reset();
    this.notes.reset();
    this.status.reset();
  }
}

export { ClientState };
