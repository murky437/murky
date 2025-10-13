import { createMutable } from 'solid-js/store';

interface AuthData {
  accessToken: string | null;
}

const authData = createMutable<AuthData>({
  accessToken: localStorage.getItem('accessToken'),
});

const auth = {
  getAccessToken: () => {
    return authData.accessToken;
  },
  setAccessToken: (accessToken: string | null) => {
    authData.accessToken = accessToken;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  },
};

export { auth };
