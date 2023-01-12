import React from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './CreateOrderedGroupAssignmentForm.module.scss';
import useApiData from '../../../../../../hooks/useApiData';
import Loading from '../../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../../Common/Error/Error';
import Table from '../../../../Common/Table/Table/Table';
import FormTextField from '../../../../Common/FormTextField/FormTextField';
import FormCheckbox from '../../../../Common/FormCheckbox/FormCheckbox';

export default function CreateOrderedGroupAssignmentForm() {
  const [selectedCognitoIds, setSelectedCognitoIds] = React.useState();
  const { register, setValue } = useFormContext();

  const { data, isLoading, error } = useApiData({
    path: `/administrator/users/groups/participants`,
    params: {
      includeStayAssignmentCount: true,
    },
  });

  register('cognitoIds');

  React.useEffect(() => {
    setValue('cognitoIds', selectedCognitoIds);
  }, [selectedCognitoIds, setValue]);

  if (isLoading) {
    return <Loading message="Fetching participants..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  return (
    <>
      <div className={styles.fields}>
        <FormTextField
          name="name"
          label="Name"
          defaultHelperText="Name for this ordered assignment group."
          rules={{
            required: { value: true, message: 'Name is required.' },
          }}
        />
        <FormTextField
          name="sharedStayCount"
          label="Shared stay count"
          defaultHelperText="Number of stays which will be assigned to (and shared between) all of the participants."
          rules={{
            required: {
              value: true,
              message: 'Shared stay count is required.',
            },
          }}
          type="number"
        />
        <FormTextField
          name="individualStayCount"
          label="Individual stay count"
          defaultHelperText="Number of unique stays which will be assigned to each of the participants."
          rules={{
            required: {
              value: true,
              message: 'Individual stay count is required.',
            },
          }}
          type="number"
        />
      </div>
      <div className={styles.fields}>
        <FormCheckbox
          name="addUsersByDefault"
          label="Add new users to this group by default"
          defaultHelperText="Tick this box if you want the newly created users to be automatically added to this group."
        />
      </div>
      <div className={styles.table}>
        <Table
          rows={data}
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
