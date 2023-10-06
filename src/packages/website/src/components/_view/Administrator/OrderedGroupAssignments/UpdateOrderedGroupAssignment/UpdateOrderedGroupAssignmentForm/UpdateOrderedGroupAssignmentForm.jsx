import React from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './UpdateOrderedGroupAssignmentForm.module.scss';
import useApiData from '../../../../../../hooks/useApiData';
import Loading from '../../../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../../../Common/Error/Error';
import Table from '../../../../Common/Table/Table/Table';
import FormTextField from '../../../../Common/FormTextField/FormTextField';
import FormCheckbox from '../../../../Common/FormCheckbox/FormCheckbox';

export default function UpdateOrderedGroupAssignmentForm(props) {
  const { name, addUsersByDefault, cognitoIds } = props;
  const [selectedCognitoIds, setSelectedCognitoIds] = React.useState();
  const { register, setValue } = useFormContext();
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

  register('cognitoIds');

  React.useEffect(() => {
    setValue('cognitoIds', selectedCognitoIds);
  }, [selectedCognitoIds, setValue]);

  if (participantsIsLoading) {
    return <Loading message="Fetching participants..." />;
  }

  if (participantsError || participantsData === null) {
    return getErrorComponentFromHttpError(participantsError);
  }

  return (
    <>
      <div className={styles.name}>
        <FormTextField
          name="name"
          label="Name"
          defaultValue={name}
          rules={{
            required: { value: true, message: 'Name is required.' },
          }}
        />
        <FormCheckbox
          name="addUsersByDefault"
          label="Add new users to this group by default"
          defaultHelperText="Tick this box if you want the newly created users to be automatically added to this group."
          defaultValue={addUsersByDefault}
        />
      </div>
      <div className={styles.table}>
        <Table
          rows={participantsData}
          allowSort
          allowSelect
          defaultSelected={cognitoIds}
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
