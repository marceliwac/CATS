import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';

export default function SignOut() {
  const navigate = useNavigate();

  React.useEffect(() => {
    Amplify.Auth.signOut().then(() => {
      navigate('/');
    });
  }, [navigate]);

  return <></>;
}
