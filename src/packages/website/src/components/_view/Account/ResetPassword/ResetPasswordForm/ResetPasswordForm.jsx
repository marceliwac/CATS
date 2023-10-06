import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import FormTextField from '../../../Common/FormTextField/FormTextField';
import { equalValidator } from '../../../../../util/FormValidatorFunctions';

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const { getFieldState, trigger, getValues } = useFormContext();
  const passwordsMatchValidator = equalValidator(
    getValues,
    'newPassword',
    'repeatNewPassword',
    'Passwords do not match.'
  );

  return (
    <>
      <FormTextField
        name="email"
        label="E-mail address"
        autocomplete="email"
        defaultValue={searchParams.get('email')}
        rules={{
          required: { value: true, message: 'E-mail address is required.' },
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'E-mail address must be a valid e-mail.',
          },
        }}
      />
      <FormTextField
        name="verificationCode"
        label="Verification code"
        autocomplete="off"
        defaultValue={searchParams.get('code')}
        rules={{
          required: {
            value: true,
            message: 'Verification code is required.',
          },
        }}
      />
      <FormTextField
        name="newPassword"
        label="New password"
        type="password"
        autocomplete="off"
        defaultHelperText="Password has to have at least 8 characters, including one number, one upper-case and one lower-case character."
        rules={{
          required: { value: true, message: 'Password is required.' },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}$/,
            message:
              'Password has to have at least 8 characters, including one number, one upper-case and one lower-case character.',
          },
          validate: {
            triggerRepeatPasswordValidation: () => {
              const repeatNewPasswordState = getFieldState('repeatNewPassword');
              if (repeatNewPasswordState && repeatNewPasswordState.isDirty) {
                trigger('repeatNewPassword');
              }
            },
          },
        }}
      />
      <FormTextField
        name="repeatNewPassword"
        label="Repeat new password"
        type="password"
        autocomplete="off"
        rules={{
          required: {
            value: true,
            message: 'New password has to be repeated.',
          },
          validate: {
            passwordsMatchValidator,
          },
        }}
      />
    </>
  );
}
