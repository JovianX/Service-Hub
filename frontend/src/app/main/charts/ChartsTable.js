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
import { getChartList, selectIsChartsLoading, selectCharts } from 'app/store/chartsSlice';

import { getSelectItemsFromArray, getUniqueKeysFromTableData } from '../../uitls';

import ChartsFilters from './ChartsFilters';

const ChartsTable = () => {
  const [charts, setCharts] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepository, setSelectedRepository] = useState('all');
  const [searchText, setSearchText] = useState('');

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

    if (searchText !== '') {
      filteredCharts = filteredCharts.filter(({ name, application_name, repository_name, description }) => {
        return (
          name.includes(searchText) ||
          application_name.includes(searchText) ||
          repository_name.includes(searchText) ||
          description.includes(searchText)
        );
      });
    }

    setCharts(filteredCharts);
  }, [selectedRepository, searchText]);

  const handleSelectedRepository = (event) => {
    setSelectedRepository(event.target.value);
  };

  const handleSearchText = (event) => {
    setSearchText(event.target.value);
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
        searchText={searchText}
        handleSearchText={handleSearchText}
      />

      <Paper className='h-full mx-12 rounded'>
        <FuseScrollbars className='grow overflow-x-auto'>
          <TableContainer>
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
                    <TableCell align='left'>{row.name}</TableCell>
                    <TableCell align='left'>{row.version}</TableCell>
                    <TableCell align='left'>{row.application_name}</TableCell>
                    <TableCell align='left'>{row.application_version}</TableCell>
                    <TableCell align='left'>{row.repository_name}</TableCell>
                    <TableCell align='left'>{row.description}</TableCell>
                    <TableCell align='left'>-</TableCell>
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

export default ChartsTable;
