import React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { useFormContext } from 'react-hook-form';
import styles from './FormCustomValidationGroup.module.scss';
/**
 *
 * @param props: {name, control, rules, defaultValue, label} useController options
 * @returns {JSX.Element} TextField input element
 * @constructor
 */
export default function FormCustomValidationGroup(props) {
  const {
    name,
    label,
    defaultHelperText,
    preserveHeight,
    children,
    customValidator,
    customValidatorError,
    fieldsToWatch,
    className,
  } = props;
  const { watch, setError, getFieldState, trigger, getValues } =
    useFormContext();

  let displayedDefaultHelperText = preserveHeight ? ' ' : '';
  if (defaultHelperText) {
    displayedDefaultHelperText = defaultHelperText;
  }
  const [helperText, setHelperText] = React.useState(
    displayedDefaultHelperText
  );
  const [isValid, setIsValid] = React.useState(false);

  const watchedFields = watch(fieldsToWatch);

  React.useEffect(() => {
    setIsValid(customValidator());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customValidator, ...watchedFields]);

  React.useEffect(() => {
    if (isValid) {
      setHelperText(displayedDefaultHelperText);
      fieldsToWatch.forEach((fieldName) => {
        const field = getFieldState(fieldName);
        const hasValue = !!getValues(fieldName);

        if (field.isDirty || hasValue) {
          trigger(fieldName);
        }
      });
    } else {
      setHelperText(customValidatorError);
      fieldsToWatch.forEach((fieldName) => {
        const field = getFieldState(fieldName);
        const hasValue = !!getValues(fieldName);
        if (field.isDirty || hasValue) {
          setError(fieldName, '');
        }
      });
    }
  }, [
    customValidatorError,
    displayedDefaultHelperText,
    isValid,
    fieldsToWatch,
    setError,
    trigger,
    getFieldState,
    getValues,
  ]);

  const labelId = `${name}-label`;
  const helperId = `${name}-helper-text`;

  return (
    <FormGroup
      className={`${styles.customValidationGroup}${` ${className}` || ' '}`}
    >
      {label && (
        <FormLabel id={labelId} className={styles.label}>
          {label}
        </FormLabel>
      )}
      {children}
      <FormHelperText
        id={helperId}
        className={styles.helperText}
        error={!isValid}
      >
        {helperText}
      </FormHelperText>
    </FormGroup>
  );
}
