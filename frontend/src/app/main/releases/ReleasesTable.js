import AutoDeleteOutlinedIcon from '@mui/icons-material/AutoDeleteOutlined';
import {
  Button,
  Chip,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import withRouter from '@fuse/core/withRouter';
import { getReleases, selectIsReleasesLoading, selectReleases } from 'app/store/releasesSlice';

import { getReleaseHealth, getReleaseTtl } from '../../api';
import {
  checkTrimString,
  getSelectItemsFromArray,
  getUniqueKeysFromTableData,
  getColorForStatus,
  getPresent,
} from '../../uitls';

import ReleasesDeleteModal from './ReleasesDeleteModal';
import ReleasesFilters from './ReleasesFilters';
import TtlModal from './ttlModal';

const ReleasesTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [namespaces, setNamespaces] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [releases, setReleases] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [healthRows, setHealthRows] = useState({});
  const [ttls, setTtls] = useState({});
  const [selectedParameters, setSelectedParameters] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteInfo, setOpenDeleteInfo] = useState({});

  const releasesData = useSelector(selectReleases);
  const isLoading = useSelector(selectIsReleasesLoading);
  useEffect(() => {
    setReleases(releasesData);
    getHealthRows(releasesData);
    getTtlRows(releasesData);
  }, [releasesData]);

  useEffect(() => {
    dispatch(getReleases());
  }, [dispatch]);

  useEffect(() => {
    getTtlRows(releasesData);
  }, [refresh]);

  useEffect(() => {
    if (releasesData?.length) {
      const uniqueNamespaces = getUniqueKeysFromTableData(releasesData, 'namespace');
      const uniqueClusters = getUniqueKeysFromTableData(releasesData, 'context_name');
      const namespacesSelectOptions = getSelectItemsFromArray(uniqueNamespaces);
      const clustersSelectOptions = getSelectItemsFromArray(uniqueClusters);
      setNamespaces(namespacesSelectOptions);
      setClusters(clustersSelectOptions);
    }
  }, [releasesData]);

  useEffect(() => {
    let filteredReleases = releasesData;
    if (selectedNamespace !== 'all') {
      filteredReleases = filteredReleases.filter((el) => el.namespace === selectedNamespace);
    }
    if (selectedCluster !== 'all') {
      filteredReleases = filteredReleases.filter((el) => el.context_name === selectedCluster);
    }
    setReleases(filteredReleases);
  }, [selectedNamespace, selectedCluster]);

  async function getHealthRows(releases) {
    if (releases.length) {
      await releases.map((row, index) => {
        getReleaseHealth(row.context_name, row.namespace, row.name).then((res) => {
          const healthStatus = {};
          healthStatus[index] = res.data.status;
          setHealthRows((healthRows) => ({ ...healthRows, ...healthStatus }));
        });
      });
    }
  }

  async function getTtlRows(releases) {
    if (releases.length) {
      await releases.map((row, index) => {
        getReleaseTtl(row.context_name, row.namespace, row.name).then((res) => {
          const scheduledTime = {};
          scheduledTime[index] = res.data.scheduled_time;
          setTtls((ttl) => ({ ...ttl, ...scheduledTime }));
        });
      });
    }
  }

  const handleSelectedNamespace = (e) => {
    setSelectedNamespace(e.target.value);
  };

  const handleSelectedCluster = (e) => {
    setSelectedCluster(e.target.value);
  };

  if (isLoading) {
    return (
      <div className='w-full flex flex-col min-h-full'>
        <FuseLoading />
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col min-h-full'>
      <ReleasesFilters
        selectedNamespace={selectedNamespace}
        setSelectedNamespace={handleSelectedNamespace}
        namespaces={namespaces}
        selectedCluster={selectedCluster}
        setSelectedCluster={handleSelectedCluster}
        clusters={clusters}
        className='p-24'
      />

      <Paper className='h-full mx-24 rounded'>
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
                {releases?.map((row, index) => (
                  <TableRow
                    key={`${row.namespace}-${row.name}-${row.context_name}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align='left'>
                      <div
                        className='hover:cursor-pointer underline'
                        onClick={() => {
                          navigate(`${row.namespace}-${row.name}-${row.context_name}`, {
                            state: {
                              release: row,
                              ttl: ttls[index],
                              health: healthRows[index],
                            },
                          });
                        }}
                      >
                        {row.name}
                      </div>
                    </TableCell>

                    <TableCell align='left'>
                      {healthRows[index] ? (
                        <Stack>
                          <Chip
                            className='capitalize'
                            label={healthRows[index]}
                            color={getColorForStatus(healthRows[index])}
                          />
                        </Stack>
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell align='left'>{checkTrimString(row.namespace, 50, 15)}</TableCell>
                    <TableCell align='left'>{checkTrimString(row.context_name, 50, 15)}</TableCell>
                    <TableCell align='left'>{row.chart}</TableCell>
                    <TableCell align='left'>{row.application_version}</TableCell>
                    <TableCell align='left'>{getPresent(row.updated)}</TableCell>
                    <TableCell lign='left'>{ttls[index] ? getPresent(ttls[index]) : ''}</TableCell>
                    <TableCell align='left'>{row.revision}</TableCell>
                    <TableCell align='left'>
                      <Stack>
                        <Chip label={row.status} color={getColorForStatus(row.status)} />
                      </Stack>
                    </TableCell>
                    <TableCell align='left'>
                      <ButtonGroup aria-label='primary button group'>
                        <Button
                          variant='text'
                          color='error'
                          onClick={() => {
                            setSelectedParameters({
                              ttlCellIndex: index,
                              currentDate: ttls[index],
                              context_name: row.context_name,
                              namespace: row.namespace,
                              name: row.name,
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
                              name: row.name,
                              namespace: row.namespace,
                              context_name: row.context_name,
                            });
                          }}
                        >
                          <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
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
      </Paper>

      {openDeleteModal && (
        <ReleasesDeleteModal
          options={{
            title: `Delete release ${openDeleteInfo.name}?`,
            text: 'Are you sure you want to proceed',
            confirmText: 'Delete',
          }}
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          openDeleteInfo={openDeleteInfo}
        />
      )}
    </div>
  );
};

export default withRouter(ReleasesTable);
