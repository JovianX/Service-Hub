import { Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';

import { checkTrimString, getColorForStatus, getPresent } from '../../../uitls';

const ReleaseTable = ({ release, ttl, health }) => {
  return (
    <Paper className='h-100 rounded mt-12'>
      <FuseScrollbars className='grow overflow-x-auto'>
        <TableContainer>
          <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
            <TableHead>
              <TableRow>
                <TableCell>Release Name</TableCell>
                <TableCell align='center'>Health</TableCell>
                <TableCell>Namespace</TableCell>
                <TableCell>Cluster</TableCell>
                <TableCell>Chart</TableCell>
                <TableCell>App Version</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell>TTL</TableCell>
                <TableCell>Revision</TableCell>
                <TableCell align='center'>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow key={release.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align='left'>{release.name}</TableCell>
                <TableCell align='left'>
                  <Stack>
                    <Chip className='capitalize' label={health} color={getColorForStatus(health)} />
                  </Stack>
                </TableCell>
                <TableCell align='left'>{checkTrimString(release.namespace, 50, 15)}</TableCell>
                <TableCell align='left'>{checkTrimString(release.context_name, 50, 15)}</TableCell>
                <TableCell align='left'>{release.chart}</TableCell>
                <TableCell align='left'>{release.application_version}</TableCell>
                <TableCell align='left'>{getPresent(release.updated)}</TableCell>
                <TableCell lign='left'>{ttl ? getPresent(ttl) : ''}</TableCell>
                <TableCell align='left'>{release.revision}</TableCell>
                <TableCell align='left'>
                  <Stack>
                    <Chip label={release.status} color={getColorForStatus(release.status)} />
                  </Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </FuseScrollbars>
    </Paper>
  );
};

export default ReleaseTable;
