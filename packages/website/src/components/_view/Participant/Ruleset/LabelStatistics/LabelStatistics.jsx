import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './LabelStatistics.module.scss';

const renderCustomizedLabel = ({ cx, percent, index }) => {
  if (index === 0) {
    return (
      <>
        <text
          x={cx}
          y="35%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="1.5em"
        >
          {`${(percent * 100).toFixed(2)}%`}
        </text>
        <text x={cx} y="50%" textAnchor="middle" dominantBaseline="central">
          {index % 2 === 0 ? 'of total duration' : ''}
        </text>
        <text x={cx} y="60%" textAnchor="middle" dominantBaseline="central">
          {index % 2 === 0 ? 'labelled as' : ''}
        </text>
        <text x={cx} y="70%" textAnchor="middle" dominantBaseline="central">
          {index % 2 === 0 ? 'weaning' : ''}
        </text>
        {/* <text x={cx} y="62.5%" textAnchor="middle" dominantBaseline="central"> */}
        {/*  {index % 2 === 0 ? 'weaning' : ''} */}
        {/* </text> */}
      </>
    );
  }
  return <></>;
};

function hoursToString(v) {
  // const weeks = Math.floor(v / (24 * 7));
  const days = Math.floor(v / 24);
  const hours = Math.floor(v - days * 24);
  const minutes = Math.floor((v - Math.floor(v)) * 60);

  let str = days > 0 ? ` ${days.toFixed(0)}d${days !== '1' ? '' : ''}` : '';
  str += hours > 0 ? ` ${hours.toFixed(0)}h${hours !== 1 ? '' : ''}` : '';
  str += minutes > 0 ? ` ${minutes.toFixed(0)}m${minutes !== 1 ? '' : ''}` : '';

  return str.trim();
}

export default function LabelStatistics(props) {
  const { statistics } = props;

  const { total } = statistics;
  const { totalDuration, totalLabelDuration } = total;

  const pieData = [
    {
      key: 'totalLabelDuration',
      color: '#27d0b1',
      value: totalLabelDuration,
    },
    {
      key: 'totalDuration',
      color: '#61a0ff',
      value: totalDuration - totalLabelDuration,
    },
  ];

  const startAngle = 360 * (1 - totalLabelDuration / totalDuration / 2) + 45;
  const endAngle = startAngle + 360;

  const parameters = [
    {
      key: 'rowCount',
      value: total.rowCount.toLocaleString('en'),
      label: 'Rows processed',
    },
    {
      key: 'labelCount',
      value: total.labelCount.toLocaleString('en'),
      label: 'Labels created',
    },
    {
      key: 'minLabelDuration',
      value: hoursToString(total.minLabelDuration),
      label: 'Shortest label duration',
    },
    {
      key: 'labelledRowCount',
      value: total.labelledRowCount.toLocaleString('en'),
      label: 'Rows labelled',
    },
    {
      key: 'avgLabelDuration',
      value: hoursToString(total.avgLabelDuration),
      label: 'Average label duration',
    },
    {
      key: 'maxLabelDuration',
      value: hoursToString(total.maxLabelDuration),
      label: 'Longest label duration',
    },
  ];

  return (
    <div className={styles.labelStatistics}>
      <div className={styles.pieChart}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              startAngle={startAngle}
              endAngle={endAngle}
              data={pieData}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="100%"
              innerRadius="90%"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`label-statistics-${entry.key}`}
                  fill={entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.parameters}>
        {parameters.map((p) => (
          <div key={p.key} className={styles.parameter}>
            <p className={styles.label}>{p.label}</p>
            <p className={styles.value}>{p.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
