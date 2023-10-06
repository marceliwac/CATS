import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthenticationContext from '../../contexts/AuthenticationContext';
/**
 * Only allows the component to be displayed if the user is authenticated and an administrator. This
 * means that unauthenticated users, or authenticated users who are not administrators will NOT be
 * allowed to see the contents.
 * @param Component component to be wrapped in Authenticated Admin Route.
 * @returns {(function(*): (*|null))|*} Component if the user is authenticated and an administrator,
 * otherwise a redirect to '/signIn' (for unauthenticated users) or '/' (for non-administrators).
 */
export default function AuthenticatedParticipantRoute(Component) {
  return function WrappedAuthenticatedRoute(props) {
    const { credentials, isParticipant } = React.useContext(
      AuthenticationContext
    );

    if (credentials && isParticipant) {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Component {...props} credentials={credentials} />;
    }
    return <Navigate to="/" replace />;
  };
}
