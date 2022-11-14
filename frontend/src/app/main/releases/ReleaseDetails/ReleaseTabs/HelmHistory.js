import { Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import { selectReleaseHistory } from 'app/store/releaseSlice';

import { getColorForStatus, getPresent } from '../../../../uitls';

import RollbackRelease from './RollbackRelease';

const HelmHistory = ({ release }) => {
  const [releaseHistory, setReleaseHistory] = useState([]);
  const releaseHistoryData = useSelector(selectReleaseHistory);

  useEffect(() => {
    if (releaseHistoryData.length) {
      setReleaseHistory([...releaseHistoryData].sort((a, b) => b.revision - a.revision));
    }
  }, [releaseHistoryData]);

  return (
    <Paper className='h-100 rounded mt-12'>
      <FuseScrollbars className='grow overflow-x-auto'>
        <TableContainer>
          <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
            <TableHead>
              <TableRow>
                <TableCell>Revision</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell>App Name</TableCell>
                <TableCell>App Version</TableCell>
                <TableCell>Chart</TableCell>
                <TableCell> Chart Version</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {releaseHistory?.map((row) => (
                <TableRow key={row.revision}>
                  <TableCell align='left'>{row.revision}</TableCell>
                  <TableCell align='left'>{getPresent(row.updated)}</TableCell>
                  <TableCell align='left'>{row.application_name}</TableCell>
                  <TableCell align='left'>{row.app_version}</TableCell>
                  <TableCell align='left'>{row.chart}</TableCell>
                  <TableCell align='left'>{row.chart_version}</TableCell>
                  <TableCell align='left'>
                    <Stack>
                      <Chip label={row.status} color={getColorForStatus(row.status)} />
                    </Stack>
                  </TableCell>
                  <TableCell align='left'>{row.description}</TableCell>
                  <TableCell align='left'>
                    <RollbackRelease
                      revision={row.revision}
                      namespace={release.namespace}
                      name={release.name}
                      contextName={release.context_name}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </FuseScrollbars>
    </Paper>
  );
};

export default HelmHistory;
