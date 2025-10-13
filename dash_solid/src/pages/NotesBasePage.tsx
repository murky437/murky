import { auth } from '../auth/auth.ts';

function NotesBasePage() {
  return (
    <div>
      <div>base page</div>
      {/*<div>accessToken: {auth.getAccessToken()}</div>*/}
    </div>
  );
}

export { NotesBasePage };
