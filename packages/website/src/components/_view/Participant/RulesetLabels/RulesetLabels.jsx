import React from 'react';
import { useParams } from 'react-router-dom';
import BookmarkRemoveOutlinedIcon from '@mui/icons-material/BookmarkRemoveOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import useApiData from '../../../../hooks/useApiData';
import Loading from '../../Common/Loading/Loading';
import { getErrorComponentFromHttpError } from '../../Common/Error/Error';
import layoutStyles from '../../../_layouts/Layout/Layout.module.scss';
import RulesetStayTable from './RulesetStayTable/RulesetStayTable/RulesetStayTable';
import APIClient from '../../../../util/APIClient';

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

export default function RulesetLabels() {
  const { rulesetId, stayId } = useParams();
  const { data, error, isLoading, reload } = useApiData({
    path: `/participant/rulesets/${rulesetId}`,
    params: {
      stayId,
      includeRulesetLabels: true,
      includeStayData: true,
    },
  });

  if (isLoading) {
    return <Loading message="Fetching ruleset and stay..." />;
  }

  if (error || data === null) {
    return getErrorComponentFromHttpError(error);
  }

  const formattedStays = formatData(data);

  async function pinStay() {
    await APIClient.put(`/participant/pinnedStays/${stayId}`);
    reload();
  }

  return (
    <div className={layoutStyles.forceFullWidth}>
      <RulesetStayTable
        title={`${data.name} labels for ${stayId}`}
        labels={data.labels}
        ruleset={data.parsedRuleset}
        parameters={data.parameters}
        rows={formattedStays.rows}
        columns={formattedStays.columns}
        topButtons={[
          {
            label: `${data.isStayPinned ? 'Unpin' : 'Pin'} stay`,
            handler: () => pinStay(),
            variant: 'outlined',
            icon: data.isStayPinned ? (
              <BookmarkRemoveOutlinedIcon />
            ) : (
              <BookmarkAddOutlinedIcon />
            ),
          },
        ]}
      />
    </div>
  );
}
