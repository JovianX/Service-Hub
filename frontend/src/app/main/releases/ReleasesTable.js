import { Button } from '@mui/material';
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

import { checkTrimString, getTimeFormat, getSelectItemsFromArray, getUniqueKeysFromTableData } from '../../uitls';

import ReleasesFilters from './ReleasesFilters';

const ReleasesTable = () => {
  const [namespaces, setNamespaces] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [releases, setReleases] = useState([]);

  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState('all');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [releaseToDelete, setReleaseToDelete] = useState(null);

  const dispatch = useDispatch();
  const releasesData = useSelector(selectReleases);
  const isLoading = useSelector(selectIsReleasesLoading);

  useEffect(() => {
    setReleases(releasesData);
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
        className='p-12'
      />

      <Paper className='h-full mx-12 rounded'>
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
                {releases?.map((row) => (
                  <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align='left'>{row.name}</TableCell>
                    <TableCell align='left'>{row.status}</TableCell>
                    <TableCell align='left'>{row.health_status}</TableCell>
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
