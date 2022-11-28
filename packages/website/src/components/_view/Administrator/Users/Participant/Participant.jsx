import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './Participant.module.scss';
import Table, {
  USER_STATUS_COLUMN_ENUM,
} from '../../../Common/Table/Table/Table';
import useApiData from '../../../../../hooks/useApiData';
import Loading from '../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../Common/Error/Error';

export default function Participant() {
  const { userId } = useParams();

  const { data, error, isLoading } = useApiData({
    path: `/administrator/users/groups/participants/${userId}`,
  });

  if (isLoading) {
    return <Loading message="Fetching participant..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  const tableData = data.assignedStays;

  return (
    <div className={styles.participant}>
      <div className={styles.tiles}>
        {/* <Link to="participants" className={styles.tile}> */}
        {/*  <h3>Invited participants</h3> */}
        {/*  <p>{data.participantCount}</p> */}
        {/* </Link> */}
        {/* <Link to="researchers" className={styles.tile}> */}
        {/*  <h3>Researchers</h3> */}
        {/*  <p>{data.researcherCount}</p> */}
        {/* </Link> */}
        {/* <Link to="questionnaires" className={styles.tile}> */}
        {/*  <h3>Questionnaires</h3> */}
        {/*  <p>{data.questionnaireCount}</p> */}
        {/* </Link> */}
        {/* <div className={styles.tile}> */}
        {/*  <h3>Study duration</h3> */}
        {/*  <p>{data.duration} days</p> */}
        {/* </div> */}
      </div>

      <div className={styles.assignedStays}>
        <Table
          rows={tableData}
          title="Assigned stays"
          linkFunction={(id) => `/administrator/stays/${id}`}
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
            {
              id: 'labelCount',
              label: 'Label count',
              numeric: true,
            },
          ]}
        />
      </div>
    </div>
  );
}
