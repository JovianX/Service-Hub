import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import { getChartList, selectIsChartsLoading, selectCharts } from 'app/store/chartsSlice';

import { getSelectItemsFromArray, getUniqueKeysFromTableData } from '../../uitls';

import ChartsFilters from './ChartsFilters';

const ChartsTable = () => {
  const [charts, setCharts] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepository, setSelectedRepository] = useState('all');

  const dispatch = useDispatch();
  const chartData = useSelector(selectCharts);
  const isLoading = useSelector(selectIsChartsLoading);

  useEffect(() => {
    setCharts(chartData);
  }, [chartData]);

  useEffect(() => {
    dispatch(getChartList());
  }, [dispatch]);

  useEffect(() => {
    if (chartData?.length) {
      const uniqueRepositories = getUniqueKeysFromTableData(chartData, 'repository_name');

      const namespacesSelectOptions = getSelectItemsFromArray(uniqueRepositories);

      setRepositories(namespacesSelectOptions);
    }
  }, [chartData]);

  useEffect(() => {
    let filteredCharts = chartData;

    if (selectedRepository !== 'all') {
      filteredCharts = filteredCharts.filter((el) => el.repository_name === selectedRepository);
    }

    setCharts(filteredCharts);
  }, [selectedRepository]);

  const handleSelectedRepository = (event) => {
    setSelectedRepository(event.target.value);
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
      <ChartsFilters
        repositories={repositories}
        selectedRepository={selectedRepository}
        setSelectedRepository={handleSelectedRepository}
      />

      <FuseScrollbars className='grow overflow-x-auto'>
        <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Chart Version</TableCell>
              <TableCell>App Name</TableCell>
              <TableCell>App Version</TableCell>
              <TableCell>Repository Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {charts?.map((row) => (
              <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {row.name}
                </TableCell>
                <TableCell align='right'>{row.version}</TableCell>
                <TableCell align='right'>{row.application_name}</TableCell>
                <TableCell align='right'>{row.application_version}</TableCell>
                <TableCell align='right'>{row.repository_name}</TableCell>
                <TableCell align='right'>{row.description}</TableCell>
                <TableCell align='right'>-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </FuseScrollbars>
    </div>
  );
};

export default ChartsTable;
