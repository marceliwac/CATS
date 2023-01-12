import React from 'react';
import { useParams } from 'react-router-dom';
import LabelList from './LabelList/LabelList';
import { LabellerProvider } from '../../../../hooks/useLabeller';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import styles from './StayAssignment.module.scss';
import StayTable from './StayTable/StayTable/StayTable';
import Instructions from './Instructions/Instructions';
import PatientDetails from './PatientData/PatientDetails';
import Section from './Section/Section';

function getParameters(data) {
  const rows = data.data;
  const blacklistedKeys = ['charttime', 'stay_id'];
  return Array.from(new Set(rows.map((row) => Object.keys(row)).flat())).filter(
    (key) => !blacklistedKeys.includes(key)
  );
}

function formatData(data) {
  const rows = data.data;
  const columns = rows.map((row) => row.charttime);
  const parameters = getParameters(data);
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

export default function StayAssignment() {
  const { stayAssignmentId } = useParams();
  const { data, error, isLoading } = useApiData({
    path: `/participant/stayAssignments/${stayAssignmentId}`,
    params: {
      includeLabels: true,
      includeStayDetails: true,
      includeStayData: true,
    },
  });

  if (isLoading) {
    return <Loading message="Fetching stay..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  const formattedData = formatData(data);
  const existingLabels = data.labels;

  return (
    <LabellerProvider labels={existingLabels}>
      <div className={styles.stay}>
        <Section title="Instructions">
          <Instructions />
        </Section>
        <Section title="Patient data">
          <PatientDetails details={data.details} />
        </Section>
        <Section title="Labels">
          <LabelList parameters={getParameters(data)} />
        </Section>
        <Section title="Time-series data">
          <div className={styles.tableWrapper}>
            <StayTable
              rows={formattedData.rows}
              columns={formattedData.columns}
            />
          </div>
        </Section>
      </div>
    </LabellerProvider>
  );
}
