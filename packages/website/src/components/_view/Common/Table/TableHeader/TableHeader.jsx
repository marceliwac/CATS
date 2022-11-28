import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

export default function TableHeader(props) {
  const {
    allowSelect,
    allowSort,
    selectedCount,
    onSelectAllClick,
    order,
    orderBy,
    rowCount,
    onRequestSort,
    hasLinkFunction,
    columns,
    stickyFirstCell,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {allowSelect && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={selectedCount > 0 && selectedCount < rowCount}
              checked={rowCount > 0 && selectedCount === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all',
              }}
            />
          </TableCell>
        )}
        {columns.map((column, i) => {
          const disablePadding =
            (allowSelect && i === 0) || column.disablePadding;
          const style = {};
          if (column.shrink) {
            style.width = 0;
          }
          if (i === 0 && stickyFirstCell) {
            style.position = 'sticky';
            style.left = 0;
            style.zIndex = 30;
            style.backgroundColor = '#ffffff';
          }

          if (allowSort) {
            return (
              <TableCell
                key={column.id}
                align={column.numeric ? 'center' : 'left'}
                padding={disablePadding ? 'none' : 'normal'}
                style={style}
                sortDirection={orderBy === column.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : 'asc'}
                  onClick={createSortHandler(column.id)}
                >
                  {column.label}
                  {orderBy === column.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            );
          }
          return (
            <TableCell
              key={column.id}
              align={column.numeric ? 'center' : 'left'}
              padding={disablePadding ? 'none' : 'normal'}
              style={style}
              sortDirection={orderBy === column.id ? order : false}
            >
              {column.label}
            </TableCell>
          );
        })}
        {hasLinkFunction && <TableCell />}
      </TableRow>
    </TableHead>
  );
}
