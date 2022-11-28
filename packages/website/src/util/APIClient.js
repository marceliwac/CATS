import Axios from 'axios';
import { Auth } from 'aws-amplify';

async function tryToRefreshToken(config) {
  try {
    const currentUser = await Auth.currentAuthenticatedUser();
    const currentSession = await Auth.currentSession();
    if (currentSession.isValid()) {
      // console.debug('Current session is still valid.');
    } else {
      await currentUser.refreshSession(
        currentSession.getRefreshToken(),
        (e, newSession) => {
          if (e) {
            // console.warn('Failed to refresh session!', e);
          } else {
            config.headers.Authorization = `Bearer ${newSession.getIdToken()}`;
            // console.debug('Session token refreshed!');
          }
        }
      );
    }
  } catch (error) {
    // console.warn('Could not refresh the token.', error);
  }
  return config;
}

const instance = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

instance.interceptors.request.use(tryToRefreshToken);

export default instance;
