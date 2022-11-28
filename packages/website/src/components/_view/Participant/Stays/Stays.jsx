import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import Table from '../../Common/Table/Table/Table';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import styles from './Stays.module.scss';

export default function Stays() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useApiData({
    path: '/participant/stays',
  });

  if (isLoading) {
    return <Loading message="Fetching stays..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  return (
    <div className={styles.stays}>
      <Table
        rows={data}
        title="Stays assigned to me"
        linkFunction={(id) => id}
        columns={[
          {
            id: 'stayId',
            label: 'Stay identifier',
            numeric: true,
          },
          {
            id: 'isLabelled',
            label: 'Labelled',
            boolean: true,
          },
        ]}
      />
    </div>
  );
}
