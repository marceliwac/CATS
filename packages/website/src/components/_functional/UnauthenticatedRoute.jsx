import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthenticationContext from '../../contexts/AuthenticationContext';

/**
 * Only allows the component to be displayed if the user is unauthenticated. This means that
 * authenticated users will NOT be allowed to see the contents.
 * @param Component component to be wrapped in Unauthenticated Route.
 * @returns {(function(*): (*|null))|*} Component if the user is unauthenticated, otherwise a
 * redirect to '/'.
 */
export default function UnauthenticatedRoute(Component) {
  return function WrappedAuthenticatedRoute(props) {
    const { credentials } = React.useContext(AuthenticationContext);

    if (credentials) {
      return <Navigate to="/" replace />;
    }
    return <Component {...props} />;

    // eslint-disable-next-line react/jsx-props-no-spreading
  };
}
