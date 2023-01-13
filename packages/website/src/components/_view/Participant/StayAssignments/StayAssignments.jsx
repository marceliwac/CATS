import React from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import catCup from '../../../../assets/images/cat_cup.svg';
import Table from '../../Common/Table/Table/Table';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import styles from './StayAssignments.module.scss';
import FormAlert from '../../Common/FormAlert/FormAlert';

export default function StayAssignments() {
  let formAlert = null;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data, error, isLoading } = useApiData({
    path: '/participant/stayAssignments',
  });

  if (isLoading) {
    return <Loading message="Fetching stays..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  const unlabelledData = data
    .filter((stayAssignment) => !stayAssignment.isLabelled)
    .sort((a, b) => {
      if (a.order < b.order) {
        return -1;
      }
      if (a.order > b.order) {
        return 1;
      }
      return 0;
    });
  const nextAssignmentLink =
    unlabelledData.length > 0
      ? `${unlabelledData[0].id}?isLabellingNextAssignment=true`
      : `#`;
  if (unlabelledData.length === 0 && data.length > 0) {
    formAlert = {
      title: 'All admissions labelled!',
      message:
        'All admissions assigned to you are labeled. You can still edit the labels you have created if you wish to do so!',
      severity: 'success',
    };
  }

  function navigateToNextAssignment() {
    navigate(nextAssignmentLink);
  }

  if (searchParams.get('navigateToNext') && unlabelledData.length > 0) {
    return <Navigate to={nextAssignmentLink} />;
  }

  return (
    <div className={styles.stays}>
      {formAlert && <FormAlert alert={formAlert} />}
      {(data.length > 0 && (
        <>
          <p className={styles.description}>
            Below, you will find the list of the ICU stays that have been
            assigned for you to label. You can choose to navigate to a specific
            stay by pressing the arrow button next to it, or press the button
            that will automatically take you to the next unlabelled admission.
          </p>
          {unlabelledData.length > 0 && (
            <div className={styles.button}>
              <Button
                onClick={() => navigateToNextAssignment()}
                variant="contained"
                fullWidth
              >
                Take me to the next admission
              </Button>
            </div>
          )}
          <Table
            rows={data}
            title="Stays assigned to me"
            linkFunction={(id) => id}
            defaultSortKey="order"
            columns={[
              {
                id: 'stayId',
                label: 'Stay ID',
                numeric: false,
              },
              {
                id: 'isLabelled',
                label: 'Labelled',
                boolean: true,
              },
            ]}
          />
        </>
      )) || (
        <div className={styles.noData}>
          <img src={catCup} alt="Coffee mug with a cat inside." />
          <p className={styles.description}>
            There are no assigned ICU stays for you to label.
            <br />
            If you believe this is a mistake, please{' '}
            <Link to="/support" target="_blank">
              contact support
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
