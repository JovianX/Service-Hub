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
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import { getServiceList, selectIsServicesLoading, selectServices } from 'app/store/servicesSlice';

import { getSelectItemsFromArray, getUniqueKeysFromTableData } from '../../uitls';

import ServicesFilters from './ServicesFilters';

const ServicesTable = () => {
  const [namespaces, setNamespaces] = useState([]);
  const [clusters, setClusters] = useState([]);

  const [services, setServices] = useState([]);

  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState('all');

  const dispatch = useDispatch();
  const servicesData = useSelector(selectServices);
  const isLoading = useSelector(selectIsServicesLoading);

  useEffect(() => {
    setServices(servicesData);
  }, [servicesData]);

  useEffect(() => {
    dispatch(getServiceList());
  }, [dispatch]);

  useEffect(() => {
    if (servicesData?.length) {
      const uniqueNamespaces = getUniqueKeysFromTableData(servicesData, 'health_check_settings.namespace');
      const uniqueClusters = getUniqueKeysFromTableData(servicesData, 'health_check_settings.context_name');

      const namespacesSelectOptions = getSelectItemsFromArray(uniqueNamespaces);
      const clustersSelectOptions = getSelectItemsFromArray(uniqueClusters);

      setNamespaces(namespacesSelectOptions);
      setClusters(clustersSelectOptions);
    }
  }, [servicesData]);

  useEffect(() => {
    let filteredServices = servicesData;

    if (selectedNamespace !== 'all') {
      filteredServices = filteredServices.filter((el) => el?.health_check_settings?.namespace === selectedNamespace);
    }

    if (selectedCluster !== 'all') {
      filteredServices = filteredServices.filter((el) => el?.health_check_settings?.context_name === selectedCluster);
    }

    setServices(filteredServices);
  }, [selectedNamespace, selectedCluster]);

  const handleSelectedNamespace = (event) => {
    setSelectedNamespace(event.target.value);
  };

  const handleSelectedCluster = (event) => {
    setSelectedCluster(event.target.value);
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
      <ServicesFilters
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
                  <TableCell>Service</TableCell>
                  <TableCell>Health</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Creator</TableCell>
                  <TableCell>Context Name</TableCell>
                  <TableCell>Namespace</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>

              <TableBody>
                {services?.map((row) => (
                  <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align='left'>{row.name}</TableCell>
                    <TableCell align='left'>-</TableCell>
                    <TableCell align='left'>{row.type}</TableCell>
                    <TableCell align='left'>{row?.organization?.title}</TableCell>
                    <TableCell align='left'>{row?.creator?.id}</TableCell>
                    <TableCell align='left'>{row?.health_check_settings?.context_name}</TableCell>
                    <TableCell align='left'>{row?.health_check_settings?.namespace}</TableCell>
                    <TableCell align='left'>Details</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FuseScrollbars>
      </Paper>
    </div>
  );
};

export default ServicesTable;
