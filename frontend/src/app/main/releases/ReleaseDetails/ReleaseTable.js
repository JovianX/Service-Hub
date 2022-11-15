import AutoDeleteOutlinedIcon from '@mui/icons-material/AutoDeleteOutlined';
import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'app/store/userSlice';

import { getReleaseHealth, getReleaseTtl } from '../../../api';
import { checkTrimString, getColorForStatus, getPresent } from '../../../uitls';
import ReleasesDeleteModal from '../ReleasesDeleteModal';
import TtlModal from '../ttlModal';

import RollbackRelease from './ReleaseTabs/RollbackRelease';

const ReleaseTable = ({ release, ttl, health }) => {
  const [releaseData, setReleaseData] = useState({});
  const [ttlData, setTtlData] = useState('');
  const [healthData, setHealthData] = useState('');

  const [refresh, setRefresh] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [selectedParameters, setSelectedParameters] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteInfo, setOpenDeleteInfo] = useState({});

  const user = useSelector(selectUser);

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

  useEffect(() => {
    if (releaseData?.name) {
      const fetchData = async () => {
        await getReleaseTtl(releaseData.context_name, releaseData.namespace, releaseData.name).then((res) => {
          setTtlData(res.data.scheduled_time);
        });
      };
      fetchData();
    }
  }, [refresh]);

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
                <TableCell align='center' />
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
                {user?.role === 'admin' ? (
                  <TableCell align='left'>
                    <ButtonGroup aria-label='primary button group'>
                      <RollbackRelease
                        revision={release.revision}
                        contextName={release.context_name}
                        namespace={release.namespace}
                        name={release.name}

                      />
                      <Button
                        variant='text'
                        color='error'
                        onClick={() => {
                          setSelectedParameters({
                            currentDate: ttlData,
                            context_name: release.context_name,
                            namespace: release.namespace,
                            name: release.name,
                          });
                          setOpenModal(true);
                        }}
                      >
                        <AutoDeleteOutlinedIcon />
                      </Button>
                      <Button
                        variant='text'
                        color='error'
                        onClick={() => {
                          setOpenDeleteModal(true);
                          setOpenDeleteInfo({
                            name: release.name,
                            namespace: release.namespace,
                            context_name: release.context_name,
                          });
                        }}
                      >
                        <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                ) : null}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TtlModal
          refresh={refresh}
          setRefresh={setRefresh}
          parameters={selectedParameters}
          openModal={{ openModal, setOpenModal }}
        />
      </FuseScrollbars>
      {openDeleteModal && (
        <ReleasesDeleteModal
          options={{
            title: `Delete release ${openDeleteInfo.name}?`,
            text: 'Are you sure you want to proceed',
            confirmText: 'Delete',
            is_release_page: true,
          }}
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          openDeleteInfo={openDeleteInfo}
        />
      )}
    </Paper>
  );
};

export default ReleaseTable;
