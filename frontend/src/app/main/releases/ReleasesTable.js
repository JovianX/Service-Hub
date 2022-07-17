import { Backdrop, Button, Fade, InputLabel, Modal, Select } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import withRouter from '@fuse/core/withRouter';
import { deleteRelease, getReleases, selectIsReleasesLoading, selectReleases } from 'app/store/releasesListSlice';

import { checkTrimString, getTimeFormat } from '../../uitls';

import { getSelectItemsFromArray, getUniqueKeysFromReleasesData } from './utils';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
      const uniqueNamespaces = getUniqueKeysFromReleasesData(releasesData, 'namespace');
      const uniqueClusters = getUniqueKeysFromReleasesData(releasesData, 'context_name');

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

  const renderMenuItems = (items) => {
    return items.map((namespace) => (
      <MenuItem value={namespace.value} key={namespace.value}>
        {namespace.text}
      </MenuItem>
    ));
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
      <div className='flex p-10'>
        <FormControl className='flex w-full sm:w-200 mr-10' variant='outlined'>
          <InputLabel id='category-select-label'>Namespaces</InputLabel>
          <Select
            labelId='namespace-select-label'
            id='namespace-select'
            label='Namespaces'
            value={selectedNamespace}
            onChange={handleSelectedNamespace}
          >
            <MenuItem value='all'>
              <em> All </em>
            </MenuItem>
            {renderMenuItems(namespaces)}
          </Select>
        </FormControl>

        <FormControl className='flex w-full sm:w-200' variant='outlined'>
          <InputLabel id='category-select-label'>Clusters</InputLabel>
          <Select
            labelId='cluster-select-label'
            id='cluster-select'
            label='Clusters'
            value={selectedCluster}
            onChange={handleSelectedCluster}
          >
            <MenuItem value='all'>
              <em> All </em>
            </MenuItem>
            {renderMenuItems(clusters)}
          </Select>
        </FormControl>
      </div>

      <FuseScrollbars className='grow overflow-x-auto'>
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
                <TableCell component='th' scope='row'>
                  {row.name}
                </TableCell>
                <TableCell align='right'>{row.status}</TableCell>
                <TableCell align='right'>{row.health_status}</TableCell>
                <TableCell align='right'>-</TableCell>
                <TableCell align='right'>{checkTrimString(row.namespace, 50, 15)}</TableCell>
                <TableCell align='right'>{checkTrimString(row.context_name, 50, 15)}</TableCell>
                <TableCell align='right'>{row.chart}</TableCell>
                <TableCell align='right'>{row.application_version}</TableCell>
                <TableCell align='right'>{getTimeFormat(row.updated)}</TableCell>
                <TableCell align='right'>{row.revision}</TableCell>
                <TableCell align='right'>
                  <Button variant='contained' color='error' onClick={() => handleDeleteRelease(row)}>
                    <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isDeleteModalOpen}>
          <Box sx={style}>
            <Typography id='transition-modal-title' variant='h6' component='h2'>
              Delete release {releaseToDelete?.name}
            </Typography>
            <Typography id='transition-modal-description' sx={{ mt: 2 }}>
              Are you sure you want to proceed?
            </Typography>

            <div className='flex justify-center mt-20'>
              <Button onClick={handleDeleteCancel} variant='contained' color='secondary' className='mr-10'>
                Cancel
              </Button>

              <Button onClick={handleDeleteConfirm} variant='contained' color='error'>
                Delete
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default withRouter(ReleasesTable);
