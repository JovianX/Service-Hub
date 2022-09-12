import { Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import { getChartList, selectIsChartsLoading, selectCharts } from 'app/store/chartsSlice';

import { getSelectItemsFromArray, getUniqueKeysFromTableData } from '../../uitls';

import ChartsFilters from './ChartsFilters';
import ChartsModal from './ChartsModal';

const ChartsTable = () => {
  const dispatch = useDispatch();
  const [charts, setCharts] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepository, setSelectedRepository] = useState('all');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [chartName, setChartName] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const chartData = useSelector(selectCharts);
  const isLoading = useSelector(selectIsChartsLoading);

  useEffect(() => {
    dispatch(getChartList());
  }, [dispatch]);
  useEffect(() => {
    setCharts(chartData);
  }, [chartData]);

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
      <div className='mx-14 mt-14 flex justify-between items-center'>
        <ChartsFilters
          repositories={repositories}
          selectedRepository={selectedRepository}
          setSelectedRepository={handleSelectedRepository}
        />
        <div className='mr-10'>{infoMessageSuccess && <p className='text-green'>{infoMessageSuccess}</p>}</div>
      </div>
      <Paper className='h-full mx-24 rounded'>
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
                    <TableCell align='right'>
                      <Button
                        type='submit'
                        className='mx-12'
                        variant='contained'
                        color='primary'
                        onClick={() => {
                          setChartName(row.name);
                          setOpenModal(true);
                        }}
                      >
                        Deploy
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <ChartsModal
            infoMessageSuccess={infoMessageSuccess}
            setInfoMessageSuccess={setInfoMessageSuccess}
            chartName={chartName}
            openModal={{ openModal, setOpenModal }}
          />
        </FuseScrollbars>
      </Paper>
    </div>
  );
};

export default ChartsTable;
