import React from 'react';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './Table.module.scss';
import TableSelectionToolbar from '../TableSelectionToolbar/TableSelectionToolbar';
import TableHeader from '../TableHeader/TableHeader';
import EnumElement from '../EnumElement/EnumElement';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function getDate(value) {
  const date = new Date(value);
  return `${date.getDate()} ${
    [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][date.getMonth()]
  } ${date.getFullYear()}`;
}

export const STUDY_STAGE_COLUMN_ENUM = {
  SETUP: {
    colors: {
      text: '#3c1979',
      background: '#e1dbec',
    },
    value: 'SETUP',
  },
  RECRUITMENT: {
    colors: {
      text: '#12415b',
      background: '#d4e4ed',
    },
    value: 'RECRUITMENT',
  },
  IN_PROGRESS: {
    colors: {
      text: '#204f11',
      background: '#e0f1e0',
    },
    value: 'IN PROGRESS',
  },
  FINISHED: {
    colors: {
      text: '#314141',
      background: '#c1e3de',
    },
    value: 'FINISHED',
  },
};

export const USER_STATUS_COLUMN_ENUM = {
  UNCONFIRMED: {
    colors: {
      text: '#791919',
      background: '#efe0e0',
    },
    value: 'Unconfirmed',
  },
  CONFIRMED: {
    colors: {
      text: '#204f11',
      background: '#e0f1e0',
    },
    value: 'Confirmed',
  },
  EXTERNAL_PROVIDER: {
    colors: {
      text: '#3f3f3f',
      background: '#eaeaea',
    },
    value: 'Uses third party provider',
  },
  ARCHIVED: {
    colors: {
      text: '#3f3f3f',
      background: '#eaeaea',
    },
    value: 'Archived',
  },
  UNKNOWN: {
    colors: {
      text: '#3f3f3f',
      background: '#eaeaea',
    },
    value: 'Unknown',
  },
  RESET_REQUIRED: {
    colors: {
      text: '#3f3f3f',
      background: '#eaeaea',
    },
    value: 'Password reset required',
  },
  FORCE_CHANGE_PASSWORD: {
    colors: {
      text: '#12415b',
      background: '#d4e4ed',
    },
    value: 'Password change required',
  },
};

export const PARTICIPANT_INVITATION_STATUS_COLUMN_ENUM = {
  SENT: {
    colors: {
      text: '#12415b',
      background: '#d4e4ed',
    },
    value: 'Invitation sent',
  },
  NOT_SENT: {
    colors: {
      text: '#3f3f3f',
      background: '#eaeaea',
    },
    value: 'Invitation not sent',
  },
  ACCEPTED: {
    colors: {
      text: '#204f11',
      background: '#e0f1e0',
    },
    value: 'Invitation accepted',
  },
  REJECTED: {
    colors: {
      text: '#791919',
      background: '#efe0e0',
    },
    value: 'Invitation rejected',
  },
};

export const PARTICIPANT_PARTICIPATION_STATUS_COLUMN_ENUM = {
  NOT_STARTED: {
    colors: {
      text: '#3f3f3f',
      background: '#eaeaea',
    },
    value: 'Not started',
  },
  IN_PROGRESS: {
    colors: {
      text: '#12415b',
      background: '#d4e4ed',
    },
    value: 'In progress',
  },
  FINISHED: {
    colors: {
      text: '#204f11',
      background: '#e0f1e0',
    },
    value: 'Finished',
  },
};

export default function Table(props) {
  const {
    title,
    allowSort,
    allowSelect,
    defaultSelected,
    onSelected,
    selectedActions,
    rowLinks,
    rows,
    columns,
    topButtons,
    linkFunction,
    stickyHeader,
    stickyFirstCell,
    allowPagination,
    pageSize,
  } = props;
  const rowLinkColumns =
    (typeof rowLinks === 'object' &&
      rowLinks !== null &&
      Object.keys(rowLinks)) ||
    [];

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState(
    Array.isArray(defaultSelected) ? defaultSelected : []
  );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    allowPagination ? pageSize || 20 : rows.length
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelect = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  React.useEffect(() => {
    if (typeof onSelected === 'function') {
      onSelected(selected);
    }
  }, [onSelected, selected]);

  return (
    <div className={styles.table}>
      <TableSelectionToolbar
        title={title}
        selected={selected}
        selectedActions={selectedActions}
        clearSelected={() => setSelected([])}
        topButtons={topButtons}
      />
      <TableContainer>
        <MuiTable
          stickyHeader={stickyHeader}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <TableHeader
            allowSelect={allowSelect}
            allowSort={allowSort}
            selectedCount={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            hasLinkFunction={typeof linkFunction === 'function'}
            columns={columns}
            stickyFirstCell={stickyFirstCell}
          />
          <TableBody>
            {rows
              .sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    {allowSelect && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          onChange={(event) => handleSelect(event, row.id)}
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                    )}
                    {columns.map((column, i) => {
                      const disablePadding =
                        (allowSelect && i === 0) || column.disablePadding;
                      let value = row[column.id];
                      if (['object', 'undefined'].includes(typeof value)) {
                        value = '';
                      }

                      if (column.date) {
                        value = value ? getDate(value) : '-';
                      }

                      if (column.boolean) {
                        if (typeof value === 'string') {
                          if (value.toLowerCase() === 'true') {
                            value = true;
                          } else if (value.toLowerCase() === 'false') {
                            value = false;
                          }
                        }
                        value = value ? 'Yes' : 'No';
                      }

                      if (column.enum) {
                        value = (
                          <EnumElement
                            enumObject={column.enum}
                            value={row[column.id]}
                          />
                        );
                      }

                      if (rowLinkColumns.includes(column.id)) {
                        value = (
                          <Tooltip title={rowLinks[column.id].label}>
                            <Link
                              className={styles.link}
                              to={rowLinks[column.id].to(row.id)}
                            >
                              {value}
                            </Link>
                          </Tooltip>
                        );
                      }

                      const cellStyle = {};
                      if (i === 0 && stickyFirstCell) {
                        cellStyle.position = 'sticky';
                        cellStyle.left = 0;
                        cellStyle.zIndex = 20;
                        cellStyle.backgroundColor = '#ffffff';
                      }
                      return (
                        <TableCell
                          key={`${row.id}-${column.id}`}
                          padding={disablePadding ? 'none' : 'normal'}
                          align={column.numeric ? 'center' : 'left'}
                          style={cellStyle}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                    {typeof linkFunction === 'function' && (
                      <TableCell padding="checkbox" align="center">
                        <Link
                          className={styles.buttonLink}
                          to={linkFunction(row.id)}
                        >
                          <ArrowForwardIcon />
                        </Link>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {allowPagination && (
        <TablePagination
          rowsPerPageOptions={[10, 20, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
}
