import React from 'react';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import styles from './Stay.module.scss';
import StayTable from '../../Common/StayTable/StayTable/StayTable';
import labelStyles from '../../Common/StayTable/StayTable/StayTable.module.scss';

function getLabelClassName(number) {
  const n = (number % 9) + 1;

  return styles[`label${n}`];
}

const LABEL_TARGETS = {
  STARTTIME: 'startTime',
  ENDTIME: 'endTime',
};

function getTargetLabel(currentTarget) {
  switch (currentTarget) {
    case LABEL_TARGETS.STARTTIME:
      return 'Start time';
    case LABEL_TARGETS.ENDTIME:
      return 'End time';
    default:
      return null;
  }
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

function formatData(data) {
  const rows = data.data;
  const columns = rows.map((row) => row.charttime);
  const blacklistedKeys = ['charttime', 'stay_id'];
  const parameters = Array.from(
    new Set(rows.map((row) => Object.keys(row)).flat())
  ).filter((key) => !blacklistedKeys.includes(key));
  const frames = parameters.map((parameter) => {
    const frame = { id: parameter, parameter: parameter.split('_').join(' ') };
    columns.forEach((charttime) => {
      const matchingRows = rows.filter((row) => row.charttime === charttime);
      if (matchingRows.length !== 1) {
        return;
      }
      frame[charttime] = matchingRows[0][parameter];
    });
    return frame;
  });
  return {
    columns: [
      { id: 'parameter', label: '', numeric: false },
      ...columns.map((charttime) => ({
        id: charttime,
        label: charttime,
      })),
    ],
    rows: frames,
  };
}

export default function Stay() {
  const { stayAssignmentId } = useParams();
  const { data, error, isLoading } = useApiData({
    path: `/participant/stays/${stayAssignmentId}`,
    params: {
      includeLabels: true,
      includeStayDetails: true,
      includeStayData: true,
    },
  });
  const [labels, setLabels] = React.useState([]);
  const [currentLabel, setCurrentLabel] = React.useState({});
  const [currentTarget, setCurrentTarget] = React.useState(
    LABEL_TARGETS.STARTTIME
  );
  const [isCreatingLabel, setIsCreatingLabel] = React.useState(true);

  function saveLabel() {
    setLabels((currentLabels) => [
      ...currentLabels,
      { ...currentLabel, id: uuid() },
    ]);
    setCurrentLabel({});
    setCurrentTarget(LABEL_TARGETS.STARTTIME);
    setIsCreatingLabel(false);
  }

  function setCurrentTargetValue(value) {
    if (Object.values(LABEL_TARGETS).includes(currentTarget)) {
      setCurrentLabel((previousCurrentLabel) => {
        const newCurrentLabel = { ...previousCurrentLabel };
        newCurrentLabel[currentTarget] = value;
        return newCurrentLabel;
      });
      if (currentTarget === LABEL_TARGETS.STARTTIME) {
        setCurrentTarget(LABEL_TARGETS.ENDTIME);
      }
      if (currentTarget === LABEL_TARGETS.ENDTIME) {
        setCurrentTarget(null);
      }
    }
  }

  if (isLoading) {
    return <Loading message="Fetching stay..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  const formattedData = formatData(data);

  return (
    <div className={styles.stay}>
      {labels.map((label, labelNumber) => (
        <div
          className={`${styles.label} ${getLabelClassName(labelNumber)}`}
          key={label.id}
        >
          <div className={styles.color} />
          <div className={styles.inner}>
            <h2>Label {labelNumber + 1}</h2>
            <p>
              <strong>Start time:</strong> {formatDate(label.startTime)}
            </p>
            <p>
              <strong>End time:</strong> {formatDate(label.endTime)}
            </p>
          </div>
        </div>
      ))}
      {(isCreatingLabel && (
        <div className={styles.currentLabel}>
          <div className={styles.values}>
            <p>
              <strong>Start time:</strong> {currentLabel.startTime}
            </p>
            <p>
              <strong>End time:</strong> {currentLabel.endTime}
            </p>
          </div>
          {currentTarget && (
            <div>
              Now setting: <strong>{getTargetLabel(currentTarget)}</strong>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCurrentTarget(LABEL_TARGETS.STARTTIME)}
          >
            Set start time
          </button>
          <button
            type="button"
            onClick={() => setCurrentTarget(LABEL_TARGETS.ENDTIME)}
          >
            Set end time
          </button>

          <button type="button" onClick={saveLabel}>
            Save label
          </button>
        </div>
      )) || (
        <button type="button" onClick={() => setIsCreatingLabel(true)}>
          Create new label
        </button>
      )}

      <StayTable
        rows={formattedData.rows}
        title={`Stay ${data.stayId}`}
        columns={formattedData.columns}
        selectDate={(value) => setCurrentTargetValue(value)}
        labels={labels}
      />
    </div>
  );
}
