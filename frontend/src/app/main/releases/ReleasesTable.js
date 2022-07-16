import { InputLabel, Select } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import withRouter from '@fuse/core/withRouter';
import { getReleasesList, selectIsReleasesLoading, selectReleases } from 'app/store/releasesListSlice';

import { getSelectItemsFromArray, getUniqueKeysFromReleasesData } from './utils';

const ReleasesTable = () => {
  const [namespaces, setNamespaces] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [releases, setReleases] = useState([]);

  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState('all');

  const dispatch = useDispatch();
  const releasesData = useSelector(selectReleases);
  const isLoading = useSelector(selectIsReleasesLoading);

  useEffect(() => {
    setReleases(releasesData);
  }, [releasesData]);

  useEffect(() => {
    dispatch(getReleasesList());
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
                <TableCell align='right'>{row.namespace}</TableCell>
                <TableCell align='right'>{row.context_name}</TableCell>
                <TableCell align='right'>{row.chart}</TableCell>
                <TableCell align='right'>{row.application_version}</TableCell>
                <TableCell align='right'>{row.updated}</TableCell>
                <TableCell align='right'>{row.revision}</TableCell>
                <TableCell align='right'>-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </FuseScrollbars>
    </div>
  );
};

export default withRouter(ReleasesTable);
