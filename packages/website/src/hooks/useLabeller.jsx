import React from 'react';
import uuid from 'react-uuid';
import LabellerContext from '../contexts/LabellerContext';

function labelComparator(a, b) {
  if (a.startTime < b.startTime) {
    return -1;
  }
  if (a.startTime > b.startTime) {
    return 1;
  }
  return 0;
}

function getLabelClassName(number) {
  const n = (number % 9) + 1;

  return `label${n}`;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return (
    // eslint-disable-next-line
    <>
      {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}{' '}
      {`${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${
        date.getMinutes() < 10 ? '0' : ''
      }${date.getMinutes()}`}
    </>
  );
}

export default function useLabeller() {
  return React.useContext(LabellerContext);
}

export function LabellerProvider(props) {
  const { labels: defaultLabels, children } = props;
  const [labels, setLabels] = React.useState(
    Array.isArray(defaultLabels) ? defaultLabels.sort(labelComparator) : []
  );
  const [currentLabel, setCurrentLabel] = React.useState([]);
  const [isCreatingLabel, setIsCreatingLabel] = React.useState(true);

  const toggleIsCreatingLabel = React.useCallback(() => {
    setIsCreatingLabel((current) => !current);
  }, []);

  const saveLabel = React.useCallback(
    (additionalData) => {
      if (currentLabel.length === 2) {
        const firstSmaller = currentLabel[0] < currentLabel[1];
        const startTime = firstSmaller ? currentLabel[0] : currentLabel[1];
        const endTime = firstSmaller ? currentLabel[1] : currentLabel[0];
        setLabels((currentLabels) =>
          [
            ...currentLabels,
            { id: uuid(), startTime, endTime, additionalData },
          ].sort(labelComparator)
        );
        setCurrentLabel([]);
        setIsCreatingLabel(false);
      }
    },
    [currentLabel]
  );

  const resetLabel = React.useCallback(() => {
    setCurrentLabel([]);
  }, []);

  const deleteLabel = React.useCallback((labelId) => {
    setLabels((current) =>
      [...current].filter((label) => label.id !== labelId)
    );
  }, []);

  const addDateToLabel = React.useCallback(
    (value) => {
      if (currentLabel.length === 2) {
        // Reset the label to start again.
        setCurrentLabel([value]);
      } else {
        setCurrentLabel((currentCurrentLabel) => [
          ...currentCurrentLabel,
          value,
        ]);
      }
    },
    [currentLabel.length]
  );

  return (
    <LabellerContext.Provider
      value={{
        labels,
        currentLabel,
        toggleIsCreatingLabel,
        isCreatingLabel,
        saveLabel,
        resetLabel,
        deleteLabel,
        addDateToLabel,
        getLabelClassName,
        formatDate,
      }}
    >
      {children}
    </LabellerContext.Provider>
  );
}
