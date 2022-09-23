import HourglassTopIcon from '@mui/icons-material/HourglassTop';
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
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import withRouter from '@fuse/core/withRouter';
import DialogModal from 'app/shared-components/DialogModal';
import { deleteRelease, getReleases, selectIsReleasesLoading, selectReleases } from 'app/store/releasesSlice';

import { getReleaseHealth, getReleaseTtl } from '../../api';
import { checkTrimString, getSelectItemsFromArray, getUniqueKeysFromTableData } from '../../uitls';

import ReleasesFilters from './ReleasesFilters';
import ReleasesModal from './ReleasesModal';

const newReceivedOneTtls = [];

const ReleasesTable = () => {
  const dispatch = useDispatch();

  const [receivedOneTtl, setReceivedOneTtl] = useState({});
  const [namespaces, setNamespaces] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [releases, setReleases] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [releaseToDelete, setReleaseToDelete] = useState(null);
  const [healthRows, setHealthRows] = useState({});
  const [ttls, setTtls] = useState({});
  const [selectedParameters, setSelectedParameters] = useState({});

  const [openModal, setOpenModal] = useState(false);

  const releasesData = useSelector(selectReleases);
  const isLoading = useSelector(selectIsReleasesLoading);

  useEffect(() => {
    setReleases(releasesData);
    getRows(releasesData);
  }, [releasesData]);

  useEffect(() => {
    if (releases.length && newReceivedOneTtls.length !== releases.length) {
      for (let i = 1; i <= releases.length; i++) {
        newReceivedOneTtls.push({});
      }
    }
    if (receivedOneTtl?.timestamp) {
      newReceivedOneTtls[receivedOneTtl.ttlCellIndex] = receivedOneTtl;
    }
  }, [receivedOneTtl]);

  useEffect(() => {
    dispatch(getReleases());
  }, [dispatch]);

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

  async function getRows(releases) {
    if (releases.length) {
      await releases.map((row, index) => {
        getReleaseHealth(row.context_name, row.namespace, row.name).then((res) => {
          const healthStatus = {};
          healthStatus[index] = res.data.status;
          setHealthRows((healthRows) => ({ ...healthRows, ...healthStatus }));
        });
        getReleaseTtl(row.context_name, row.namespace, row.name).then((res) => {
          const scheduledTime = {};
          scheduledTime[index] = res.data.scheduled_time;
          setTtls((ttl) => ({ ...ttl, ...scheduledTime }));
        });
      });
    }
  }

  const handleSelectedNamespace = (event) => {
    setSelectedNamespace(event.target.value);
  };

  const handleSelectedCluster = (event) => {
    setSelectedCluster(event.target.value);
  };

  const toggleDeleteModalOpen = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleDeleteRelease = ({ namespace, context_name, name }) => {
    setReleaseToDelete({
      namespace,
      context_name,
      name,
    });

    toggleDeleteModalOpen();
  };

  const handleDeleteCancel = () => {
    toggleDeleteModalOpen();
    setReleaseToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteRelease(releaseToDelete));
    toggleDeleteModalOpen();
    setReleaseToDelete(null);
    await dispatch(getReleases());
  };

  const handleStatusColor = (color) => {
    if (
      color === 'unknown' ||
      color === 'uninstalling' ||
      color === 'pending_install' ||
      color === 'pending_upgrade' ||
      color === 'pending_rollback'
    ) {
      return 'warning';
    }
    if (color === 'uninstalled' || color === 'superseded' || color === 'failed' || color === 'unhealthy') {
      return 'error';
    }
    if (color === 'deployed' || color === 'healthy') {
      return 'success';
    }
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
                  <TableCell>Status</TableCell>
                  <TableCell>Health</TableCell>
                  <TableCell>Rules</TableCell>
                  <TableCell>Namespace</TableCell>
                  <TableCell>Cluster</TableCell>
                  <TableCell>Chart</TableCell>
                  <TableCell>App Version</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell>TTL</TableCell>
                  <TableCell>Revision</TableCell>
                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {releases?.map((row, index) => (
                  <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align='left'>{row.name}</TableCell>
                    <TableCell align='left'>
                      <Stack>
                        <Chip label={row.status} color={handleStatusColor(row.status)} />
                      </Stack>
                    </TableCell>
                    <TableCell align='left'>
                      {healthRows[index] ? (
                        <Stack>
                          <Chip label={healthRows[index]} color={handleStatusColor(healthRows[index])} />
                        </Stack>
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell align='left'>-</TableCell>
                    <TableCell align='left'>{checkTrimString(row.namespace, 50, 15)}</TableCell>
                    <TableCell align='left'>{checkTrimString(row.context_name, 50, 15)}</TableCell>
                    <TableCell align='left'>{row.chart}</TableCell>
                    <TableCell align='left'>{row.application_version}</TableCell>
                    <TableCell align='left'>
                      {new Date(+row.updated * 1000).toLocaleString().replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1')}
                    </TableCell>

                    <TableCell lign='left'>
                      {newReceivedOneTtls[index] && newReceivedOneTtls[index].ttlCellIndex === index
                        ? new Date(newReceivedOneTtls[index].timestamp * 1000)
                            .toLocaleString()
                            .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1')
                        : ''}

                      {ttls[index]
                        ? new Date(+ttls[index] * 1000).toLocaleString().replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1')
                        : ''}
                    </TableCell>
                    <TableCell align='left'>{row.revision}</TableCell>
                    <TableCell align='left'>
                      <Button variant='text' color='error' onClick={() => handleDeleteRelease(row)}>
                        <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                      </Button>
                      <Button
                        variant='text'
                        color='primary'
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
                        <HourglassTopIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <ReleasesModal
            receivedOneTtl={receivedOneTtl}
            setReceivedOneTtl={setReceivedOneTtl}
            parameters={selectedParameters}
            openModal={{ openModal, setOpenModal }}
          />
        </FuseScrollbars>
      </Paper>

      <DialogModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        title={`Delete release ${releaseToDelete?.name}`}
        text='Are you sure you want to proceed?'
        onCancel={handleDeleteCancel}
        cancelText='Cancel'
        onConfirm={handleDeleteConfirm}
        confirmText='Delete'
        fullWidth
      />
    </div>
  );
};

export default withRouter(ReleasesTable);
