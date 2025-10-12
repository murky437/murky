let accessToken: string | null = localStorage.getItem('accessToken');

function isAuthenticated() {
  return accessToken !== null;
}

function getAccessToken() {
  return accessToken;
}

function setAccessToken(newAccessToken: string | null) {
  accessToken = newAccessToken;
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
}

export { isAuthenticated, getAccessToken, setAccessToken };
