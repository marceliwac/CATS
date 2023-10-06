import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import React from 'react';
import Error from '../Error/Error';

export default function NotFound() {
  return (
    <Error
      title="This page does not exist..."
      text="It looks like you might have gotten lost along the way. The page you have tried to visit does not exist!"
      icon={<SearchRoundedIcon fontSize="inherit" />}
    />
  );
}
