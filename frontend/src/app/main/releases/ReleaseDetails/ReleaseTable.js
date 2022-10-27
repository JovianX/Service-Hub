import { Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState, useEffect } from 'react';

import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';

import { getReleaseHealth, getReleaseTtl } from '../../../api';
import { checkTrimString, getColorForStatus, getPresent } from '../../../uitls';

const ReleaseTable = ({ release, ttl, health }) => {
  const [releaseData, setReleaseData] = useState({});
  const [ttlData, setTtlData] = useState('');
  const [healthData, setHealthData] = useState('');

  useEffect(() => {
    setReleaseData({
      context_name: release.context_name,
      namespace: release.namespace,
      name: release.name,
    });
  }, [release]);

  useEffect(() => {
    setTtlData(ttl);
  }, [ttl]);

  useEffect(() => {
    setHealthData(health);
  }, [health]);

  useEffect(() => {
    if (!ttlData && releaseData?.name) {
      const fetchData = async () => {
        await getReleaseTtl(releaseData.context_name, releaseData.namespace, releaseData.name).then((res) => {
          setTtlData(res.data.scheduled_time);
        });
      };
      fetchData();
    }
    if (!healthData && releaseData?.name) {
      const fetchData = async () => {
        await getReleaseHealth(releaseData.context_name, releaseData.namespace, releaseData.name).then((res) => {
          setHealthData(res.data.status);
        });
      };
      fetchData();
    }
  }, [releaseData]);

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
              <TableRow>
                <TableCell align='left'>{release.name}</TableCell>
                <TableCell align='left'>
                  <Stack>
                    {healthData ? (
                      <Chip className='capitalize' label={healthData} color={getColorForStatus(healthData)} />
                    ) : (
                      ''
                    )}
                  </Stack>
                </TableCell>
                <TableCell align='left'>{checkTrimString(release.namespace, 50, 15)}</TableCell>
                <TableCell align='left'>{checkTrimString(release.context_name, 50, 15)}</TableCell>
                <TableCell align='left'>{release.chart}</TableCell>
                <TableCell align='left'>{release.application_version}</TableCell>
                <TableCell align='left'>{getPresent(release.updated)}</TableCell>
                <TableCell lign='left'>{ttlData ? getPresent(ttlData) : ''}</TableCell>
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
