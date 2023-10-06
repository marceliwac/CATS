import React from 'react';
import styles from './EnumElement.module.scss';

export const DEFAULT_ENUM_MATCH = {
  colors: {
    background: '#d8d8d8',
    text: '#666666',
  },
};

export default function EnumElement(props) {
  const { enumObject, value } = props;

  const hasDefault = Object.prototype.hasOwnProperty.call(
    enumObject,
    'default'
  );

  let enumMatch = hasDefault ? enumObject.default : DEFAULT_ENUM_MATCH;
  if (Object.keys(enumObject).includes(value)) {
    enumMatch = enumObject[value];
  }
  const hasDisplayValue = Object.prototype.hasOwnProperty.call(
    enumMatch,
    'value'
  );
  const displayValue = hasDisplayValue ? enumMatch.value : value;

  return (
    <div
      className={styles.enum}
      style={{
        backgroundColor: enumMatch.colors.background,
        color: enumMatch.colors.text,
      }}
    >
      {displayValue}
    </div>
  );
}
