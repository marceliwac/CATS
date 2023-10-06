import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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

function formatData(data) {
  const rows = data.data;
  const columns = rows.map((row) => row.charttime);
  const parameters = data.parameters;

  // TODO: Refactor the use of parameters
  const frames = parameters.map((parameter) => {
    const frame = { id: parameter.key, parameter: parameter.label };
    columns.forEach((charttime) => {
      const matchingRows = rows.filter((row) => row.charttime === charttime);
      if (matchingRows.length !== 1) {
        return;
      }
      frame[charttime] = matchingRows[0][parameter.key];
    });
    return frame;
  });
  return {
    columns: [
      { id: 'parameter', label: '', numeric: false },
      ...columns.map((charttime) => ({
        id: charttime,
      })),
    ],
    rows: frames,
  };
}

export default function StayAssignment() {
  const { stayAssignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const isLabellingNextAssignment = searchParams.get(
    'isLabellingNextAssignment'
  );
  const { data, error, isLoading } = useApiData({
    path: `/participant/stayAssignments/${stayAssignmentId}`,
    params: {
      includeLabels: true,
      includeStayDetails: true,
      includeStayData: true,
    },
  });

  if (isLoading) {
    return (
      <Loading
        message={`Fetching ${
          isLabellingNextAssignment ? 'next assigned ' : ''
        }stay...`}
      />
    );
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
          <LabelList parameters={data.parameters} />
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
