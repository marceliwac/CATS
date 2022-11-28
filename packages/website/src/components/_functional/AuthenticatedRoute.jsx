import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthenticationContext from '../../contexts/AuthenticationContext';

/**
 * Only allows the component to be displayed if the user is authenticated. This means that
 * unauthenticated users will NOT be allowed to see the contents.
 * @param Component component to be wrapped in Authenticated Route.
 * @returns {(function(*): (*|null))|*} Component if the user is authenticated, otherwise a
 * redirect to '/signIn'.
 */
export default function AuthenticatedRoute(Component) {
  return function WrappedAuthenticatedRoute(props) {
    const { credentials } = React.useContext(AuthenticationContext);

    if (credentials) {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Component {...props} credentials={credentials} />;
    }
    return <Navigate to="/account/signIn" />;
  };
}
