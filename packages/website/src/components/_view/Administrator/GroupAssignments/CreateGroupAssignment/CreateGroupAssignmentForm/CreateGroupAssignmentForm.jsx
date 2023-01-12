import React from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './CreateGroupAssignmentForm.module.scss';
import useApiData from '../../../../../../hooks/useApiData';
import Loading from '../../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../../Common/Error/Error';
import Table from '../../../../Common/Table/Table/Table';
import FormTextField from '../../../../Common/FormTextField/FormTextField';
import FormCheckbox from '../../../../Common/FormCheckbox/FormCheckbox';

export default function CreateGroupAssignmentForm() {
  const [selectedStayIds, setSelectedStayIds] = React.useState();
  const [selectedCognitoIds, setSelectedCognitoIds] = React.useState();
  const { register, setValue } = useFormContext();

  const {
    data: stayData,
    isLoading: stayIsLoading,
    error: stayError,
  } = useApiData({
    path: `/administrator/stays`,
  });
  const {
    data: participantsData,
    isLoading: participantsIsLoading,
    error: participantsError,
  } = useApiData({
    path: `/administrator/users/groups/participants`,
    params: {
      includeStayAssignmentCount: true,
    },
  });

  register('stayIds');
  register('cognitoIds');

  React.useEffect(() => {
    setValue('stayIds', selectedStayIds);
  }, [selectedStayIds, setValue]);

  React.useEffect(() => {
    setValue('cognitoIds', selectedCognitoIds);
  }, [selectedCognitoIds, setValue]);

  if (stayIsLoading || participantsIsLoading) {
    return <Loading message="Fetching stays and participants..." />;
  }

  if (
    stayError ||
    stayData === null ||
    participantsError ||
    participantsData === null
  ) {
    return getErrorComponentFromHttpError(stayError || participantsError);
  }

  const formattedStayData = stayData.map((row) => ({ ...row, id: row.stayId }));

  return (
    <>
      <div className={styles.name}>
        <FormTextField
          name="name"
          label="Name"
          rules={{
            required: { value: true, message: 'Name is required.' },
          }}
        />

        <FormCheckbox
          name="addUsersByDefault"
          label="Add new users to this group by default"
          defaultHelperText="Tick this box if you want the newly created users to be automatically added to this group."
        />
      </div>
      <div className={styles.table}>
        <Table
          rows={formattedStayData}
          allowSort
          allowSelect
          onSelected={(selectedIds) => setSelectedStayIds(selectedIds)}
          allowPagination
          title="Stays"
          columns={[
            {
              id: 'stayId',
              label: 'Stay ID',
              numeric: false,
            },
          ]}
        />
      </div>
      <div className={styles.table}>
        <Table
          rows={participantsData}
          allowSort
          allowSelect
          onSelected={(selectedIds) => setSelectedCognitoIds(selectedIds)}
          allowPagination
          title="Participants"
          columns={[
            {
              id: 'givenName',
              label: 'First Name',
              numeric: false,
            },
            {
              id: 'familyName',
              label: 'Last Name',
              numeric: false,
            },
            {
              id: 'email',
              label: 'Email',
              numeric: false,
            },
            {
              id: 'stayAssignmentCount',
              label: 'Stay Assignment Count',
              numeric: false,
            },
          ]}
        />
      </div>
    </>
  );
}
