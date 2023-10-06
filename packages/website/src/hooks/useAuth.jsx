import React from 'react';
import Amplify, { Hub } from 'aws-amplify';
import jwtDecode from 'jwt-decode';
import APIClient from '../util/APIClient';
import AuthenticationContext from '../contexts/AuthenticationContext';

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_COGNITO_USER_POOL_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID,
  },
});

export default function useAuth() {
  return React.useContext(AuthenticationContext);
}

export function AuthenticationProvider(props) {
  const { children } = props;
  const [isAuthenticationFinished, setIsAuthenticationFinished] =
    React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [credentials, setCredentials] = React.useState(null);
  const [isAdministrator, setIsAdministrator] = React.useState(false);
  const [isParticipant, setIsParticipant] = React.useState(false);

  React.useEffect(() => {
    function updateCurrentAuthenticatedUser() {
      Amplify.Auth.currentAuthenticatedUser()
        .then((user) => {
          setCurrentUser(user);
          Amplify.Auth.currentSession().then((currentSession) => {
            const idToken = currentSession.getIdToken().getJwtToken();
            const userGroups = jwtDecode(idToken)['cognito:groups'];
            // TODO: Take the admin group name from configuration
            if (
              Array.isArray(userGroups) &&
              userGroups.includes('administrators')
            ) {
              setIsAdministrator(true);
            }
            if (
              Array.isArray(userGroups) &&
              userGroups.includes('participants')
            ) {
              setIsParticipant(true);
            }
            APIClient.defaults.headers.common.Authorization = `Bearer ${idToken}`;
            setCredentials(`Bearer ${idToken}`);
          });
        })
        .catch(() => {
          setIsAdministrator(false);
          setIsParticipant(false);
          setCurrentUser(null);
          setCredentials(null);
        })
        .finally(() => {
          setIsAuthenticationFinished(true);
        });
    }

    function onAuthEvent({ payload }) {
      // eslint-disable-next-line default-case
      switch (payload.event) {
        case 'signIn':
        case 'tokenRefresh':
          updateCurrentAuthenticatedUser();
          break;
        case 'signOut':
        case 'signIn_failure':
          setIsAdministrator(false);
          setCredentials(null);
          setCurrentUser(null);
          setIsAdministrator(false);
          setIsParticipant(false);
          APIClient.defaults.headers.common.Authorization = undefined;
          break;
      }
    }

    Hub.listen('auth', onAuthEvent);
    updateCurrentAuthenticatedUser();
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticationComplete:
          isAuthenticationFinished &&
          ((currentUser && credentials) || currentUser === null),
        isAdministrator,
        isParticipant,
        credentials,
        currentUser,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
