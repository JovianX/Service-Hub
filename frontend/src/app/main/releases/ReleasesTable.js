import { Button, Chip, CircularProgress, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import withRouter from '@fuse/core/withRouter';
import DialogModal from 'app/shared-components/DialogModal';
import { deleteRelease, getReleases, selectIsReleasesLoading, selectReleases } from 'app/store/releasesSlice';

import { getReleaseHealth as getReleaseHealthAPI } from '../../api';
import { checkTrimString, getTimeFormat, getSelectItemsFromArray, getUniqueKeysFromTableData } from '../../uitls';

import ReleasesFilters from './ReleasesFilters';

const ReleasesTable = () => {
  const dispatch = useDispatch();

  const [namespaces, setNamespaces] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [releases, setReleases] = useState([]);
  const [rows, setRows] = useState({});
  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [releaseToDelete, setReleaseToDelete] = useState(null);

  const releasesData = useSelector(selectReleases);
  const isLoading = useSelector(selectIsReleasesLoading);

  useEffect(() => {
    setReleases(releasesData);
    getRows(releasesData);
  }, [releasesData]);

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
    releases.map(async (row, id) => {
      await getReleaseHealthAPI(row.namespace, row.context_name, row.name).then((status) => {
        const newObj = {};
        newObj[id] = status.data.status;
        setRows((rows) => ({ ...rows, ...newObj }));
      });
    });
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

  const setStatusColor = (color) => {
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
      return 'danger';
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
                  <TableCell>Revision</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {releases?.map((row, num) => (
                  <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align='left'>{row.name}</TableCell>
                    <TableCell align='left'>
                      <Stack>
                        <Chip label={row.status} color={setStatusColor(row.status)} />
                      </Stack>
                    </TableCell>
                    <TableCell align='left'>
                      <Stack>
                        {rows[num] ? (
                          <Chip label={rows[num]} color={setStatusColor(rows[num])} />
                        ) : (
                          <CircularProgress color='primary' />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align='left'>-</TableCell>
                    <TableCell align='left'>{checkTrimString(row.namespace, 50, 15)}</TableCell>
                    <TableCell align='left'>{checkTrimString(row.context_name, 50, 15)}</TableCell>
                    <TableCell align='left'>{row.chart}</TableCell>
                    <TableCell align='left'>{row.application_version}</TableCell>
                    <TableCell align='left'>{getTimeFormat(row.updated)}</TableCell>
                    <TableCell align='left'>{row.revision}</TableCell>
                    <TableCell align='left'>
                      <Button variant='text' color='error' onClick={() => handleDeleteRelease(row)}>
                        <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
