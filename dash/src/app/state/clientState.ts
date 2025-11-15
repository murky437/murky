import { StatusState } from '../domain/status/state.ts';
import { AuthState } from '../domain/auth/state.ts';
import { NotesState } from '../domain/notes/state.ts';
import { SharedState } from '../domain/shared/state.ts';

class ClientState {
  readonly auth: AuthState;
  readonly notes: NotesState;
  readonly status: StatusState;
  readonly shared: SharedState;

  constructor(storage: Storage) {
    this.auth = new AuthState(storage);
    this.notes = new NotesState(storage);
    this.status = new StatusState();
    this.shared = new SharedState();
  }

  reset(): void {
    this.auth.reset();
    this.notes.reset();
    this.status.reset();
    this.shared.reset();
  }
}

export { ClientState };
