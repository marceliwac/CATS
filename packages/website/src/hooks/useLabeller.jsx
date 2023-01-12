import React from 'react';
import uuid from 'react-uuid';
import LabellerContext from '../contexts/LabellerContext';

function labelComparator(a, b) {
  if (
    a.additionalData &&
    a.additionalData.labelType &&
    b.additionalData &&
    b.additionalData.labelType
  ) {
    if (
      a.additionalData.labelType === 'general' &&
      b.additionalData.labelType === 'sprint'
    ) {
      return -1;
    }
    if (
      a.additionalData.labelType === 'sprint' &&
      b.additionalData.labelType === 'general'
    ) {
      return 1;
    }
  }
  if (a.startTime < b.startTime) {
    return -1;
  }
  if (a.startTime > b.startTime) {
    return 1;
  }
  return 0;
}

function getLabelNumber(number) {
  const n = (number % 9) + 1;

  return `${n}`;
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

function isInSelectedRange(date, startTimeDate, endTimeDate) {
  if (startTimeDate && endTimeDate) {
    return date >= startTimeDate && date <= endTimeDate;
  }
  if (startTimeDate) {
    return date >= startTimeDate;
  }
  if (endTimeDate) {
    return date <= endTimeDate;
  }
  return false;
}

export default function useLabeller() {
  return React.useContext(LabellerContext);
}

export function LabellerProvider(props) {
  const { labels: defaultLabels, children } = props;
  const [labels, setLabels] = React.useState(
    Array.isArray(defaultLabels) ? defaultLabels.sort(labelComparator) : []
  );
  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [startTimeDate, setStartTimeDate] = React.useState(null);
  const [endTimeDate, setEndTimeDate] = React.useState(null);
  const [isCreatingLabel, setIsCreatingLabel] = React.useState(true);

  const toggleIsCreatingLabel = React.useCallback(() => {
    setIsCreatingLabel((current) => !current);
  }, []);

  const saveLabel = React.useCallback(
    (additionalData) => {
      if (!startTime) {
        throw new Error('Start time is required.');
      }
      if (!endTime) {
        throw new Error('End time is required.');
      }
      if (!additionalData.confidence) {
        throw new Error('Confidence value is required.');
      }
      if (!additionalData.labelType || additionalData.labelType === '') {
        throw new Error('Label type is required.');
      }
      setLabels((currentLabels) =>
        [
          ...currentLabels,
          { id: uuid(), startTime, endTime, additionalData },
        ].sort(labelComparator)
      );
      setStartTime(null);
      setStartTimeDate(null);
      setEndTime(null);
      setEndTimeDate(null);
      setIsCreatingLabel(false);
    },

    [startTime, endTime]
  );

  const setStartTimeWrapper = React.useCallback(
    (newStartTime) => {
      if (!isCreatingLabel) {
        setIsCreatingLabel(true);
      }
      setStartTime(newStartTime);
      setStartTimeDate(newStartTime ? new Date(newStartTime) : null);
    },
    [isCreatingLabel]
  );

  const setEndTimeWrapper = React.useCallback(
    (newEndTime) => {
      if (!isCreatingLabel) {
        setIsCreatingLabel(true);
      }
      setEndTime(newEndTime);
      setEndTimeDate(newEndTime ? new Date(newEndTime) : null);
    },
    [isCreatingLabel]
  );

  const resetLabel = React.useCallback(() => {
    setStartTime(null);
    setEndTime(null);
  }, []);

  const deleteLabel = React.useCallback((labelId) => {
    setLabels((current) =>
      [...current].filter((label) => label.id !== labelId)
    );
  }, []);

  return (
    <LabellerContext.Provider
      value={{
        labels,
        startTime,
        startTimeDate,
        setStartTime: setStartTimeWrapper,
        endTime,
        endTimeDate,
        setEndTime: setEndTimeWrapper,
        isInSelectedRange,
        toggleIsCreatingLabel,
        isCreatingLabel,
        saveLabel,
        resetLabel,
        deleteLabel,
        labelComparator,
        getLabelNumber,
        formatDate,
      }}
    >
      {children}
    </LabellerContext.Provider>
  );
}
