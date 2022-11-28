import React from 'react';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import FingerprintRoundedIcon from '@mui/icons-material/FingerprintRounded';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import styles from './Error.module.scss';

export default function Error(props) {
  const { title, text, icon } = props;

  return (
    <div className={styles.error}>
      <div className={styles.icon}>
        {icon || <ErrorOutlineRoundedIcon fontSize="inherit" />}
      </div>
      {title && <h2>{title}</h2>}
      {text && <p>{text}</p>}
    </div>
  );
}

export function getErrorComponentFromHttpError(error) {
  if (error && error.response && error.response.status) {
    // eslint-disable-next-line default-case
    switch (error.response.status) {
      case 401:
        return (
          <Error
            icon={<FingerprintRoundedIcon fontSize="inherit" />}
            title="Are you authenticated?"
            text="It looks like your session might have expired. Please refresh the website or sign in and try again."
          />
        );
      case 403:
        return (
          <Error
            icon={<HttpsOutlinedIcon fontSize="inherit" />}
            title="Not authorised"
            text="You are not authorised to access this resource. If you think this is a software bug, please contact support."
          />
        );
      case 404:
        return (
          <Error
            icon={<SearchRoundedIcon fontSize="inherit" />}
            title="Resource not found"
            text="The resource you have requested does not exist or might have been deleted."
          />
        );
      case 409:
        return (
          <Error
            icon={<WarningAmberRoundedIcon fontSize="inherit" />}
            title={"Something doesn't look right..."}
            text="It appears that the action you have attempted cannot be completed. If you think this is a mistake, please contact support."
          />
        );
    }
  }
  return (
    <Error
      title="Something went wrong..."
      text="It looks like your request could not be handled correctly, please refresh the website and try again, or contact support if the problem persists."
    />
  );
}
