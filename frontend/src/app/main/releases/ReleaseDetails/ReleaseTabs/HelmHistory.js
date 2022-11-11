import { Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';

import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';

import { getColorForStatus, getPresent } from '../../../../uitls';

const HelmHistory = ({ releaseHistory }) => {
  const [reversedReleaseHistory, setReversedReleaseHistory] = useState([]);

  useEffect(() => {
    setReversedReleaseHistory(releaseHistory.sort((a, b) => b.revision - a.revision));
  }, [releaseHistory]);

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
              </TableRow>
            </TableHead>
            <TableBody>
              {reversedReleaseHistory?.map((row) => (
                <TableRow>
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
