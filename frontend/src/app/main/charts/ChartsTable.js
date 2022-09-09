import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { InputLabel, Select } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import yaml from 'js-yaml';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import { getChartList, chartInstall, selectIsChartsLoading, selectCharts } from 'app/store/chartsSlice';
import { getClustersList, selectClusters } from 'app/store/clustersSlice';

import { getSelectItemsFromArray, getUniqueKeysFromTableData } from '../../uitls';

import ChartsFilters from './ChartsFilters';
import NamespacesSelect from './NamespacesSelect';

const ChartsTable = () => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [charts, setCharts] = useState([]);
  const [chart, setChart] = useState({});
  const [repositories, setRepositories] = useState([]);
  const [selectedRepository, setSelectedRepository] = useState('all');
  const [open, setOpen] = useState(false);
  const [cluster, setCluster] = useState('');
  const [namespace, setNamespace] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [yamlErrorMessage, setYamlErrorMessage] = useState('');

  const dispatch = useDispatch();
  const chartData = useSelector(selectCharts);
  const isLoading = useSelector(selectIsChartsLoading);
  const clusterData = useSelector(selectClusters);

  const clusterContextName = useMemo(
    function () {
      // return (clusterData.find(({ name }) => name === cluster) || {}).contextName;
      return cluster;
    },
    [cluster],
  );

  useEffect(() => {
    setCharts(chartData);
  }, [chartData]);

  useEffect(() => {
    dispatch(getChartList());
    dispatch(getClustersList());
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

  // modal actions
  const handleClickSaveButton = (e) => {
    e.preventDefault();
    setLoading(true);
    if (e.target.form) {
      const { chart_name, version, description, release_name, values, context_name } = e.target.form;
      if (
        !chart_name?.value ||
        !version?.value ||
        !description?.value ||
        !release_name?.value ||
        !values?.value ||
        !context_name?.value
      ) {
        setLoading(false);
      }
    }

    inputRef.current.click();
  };

  const handleSubmitInstall = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { chart_name, version, description, release_name, values, context_name } = e.target;
    try {
      const chart = {
        chart_name: chart_name.value,
        version: version.value,
        description: description.value,
        release_name: release_name.value,
        values: yaml.load(values.value, { json: true }),
        context_name: context_name.value,
        namespace,
      };
      if (showErrorMessage) {
        await setShowErrorMessage(false);
      }
      await dispatch(chartInstall(chart));
      await setOpen(false);
      await dispatch(getChartList());
      await setLoading(false);
    } catch (e) {
      setShowErrorMessage(true);
      setLoading(false);
      setYamlErrorMessage(e.reason);
    }
  };

  const handleGetChart = (name) => {
    const data = chartData.find((item) => item.name === name);
    setChart(data);
    setOpen(true);
  };

  const handleClose = () => {
    setShowErrorMessage(false);
    setOpen(false);
  };

  const handleChangeSelect = async (e) => {
    await setCluster(e.target.value);
  };

  const handleGetNamespace = (value) => {
    setNamespace(value);
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
      <div className='mx-14 mt-14'>
        <ChartsFilters
          repositories={repositories}
          selectedRepository={selectedRepository}
          setSelectedRepository={handleSelectedRepository}
        />
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
                        onClick={() => handleGetChart(row.name)}
                      >
                        Deploy
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
            <form onSubmit={handleSubmitInstall}>
              <DialogTitle className='bg-primary text-center text-white'>Deploy new Helm release</DialogTitle>
              <DialogContent className='pb-0'>
                <div className='mt-24'>Some text</div>
                <TextField
                  name='release_name'
                  type='text'
                  required
                  id='outlined-required'
                  label='Release name'
                  margin='normal'
                  fullWidth
                />
                <TextField
                  name='chart_name'
                  type='text'
                  required
                  id='outlined-required'
                  label='Chart Name'
                  margin='normal'
                  fullWidth
                  defaultValue={chart.name}
                />
                <TextField
                  name='version'
                  type='text'
                  id='outlined-required'
                  label='Chart Version'
                  margin='normal'
                  fullWidth
                  defaultValue={chart.application_version}
                />
                <Box sx={{ minWidth: 120 }}>
                  <FormControl margin='normal' fullWidth>
                    <InputLabel id='demo-simple-select-label'>Clusters</InputLabel>
                    <Select
                      name='context_name'
                      labelId='demo-simple-select-label'
                      id='demo-simple-select-autowidth'
                      value={cluster}
                      required
                      label='Clusters'
                      onChange={handleChangeSelect}
                    >
                      {clusterData.map((cluster) => (
                        <MenuItem key={cluster.name} value={cluster.contextName}>
                          {cluster.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <NamespacesSelect
                  clusterContextName={clusterContextName}
                  handleGetNamespace={(value) => handleGetNamespace(value)}
                />

                <TextField
                  name='description'
                  type='text'
                  id='outlined-required'
                  label='Description'
                  margin='normal'
                  fullWidth
                />
                <TextField
                  name='values'
                  id='outlined-multiline-static'
                  label='Custom Values'
                  required
                  multiline
                  minRows={5}
                  maxRows={15}
                  fullWidth
                  margin='normal'
                />
              </DialogContent>
              <DialogActions className='p-24 justify-between'>
                <div>{showErrorMessage && yamlErrorMessage && <p className='text-red'>{yamlErrorMessage}</p>}</div>
                <div className='flex'>
                  <Button className='mr-14' onClick={handleClose}>
                    Cancel
                  </Button>
                  <LoadingButton
                    color='primary'
                    onClick={handleClickSaveButton}
                    loading={loading}
                    loadingPosition='start'
                    startIcon={<SaveIcon />}
                    variant='contained'
                  >
                    Deploy
                  </LoadingButton>
                  <input ref={inputRef} type='submit' className='hidden' />
                </div>
              </DialogActions>
            </form>
          </Dialog>
        </FuseScrollbars>
      </Paper>
    </div>
  );
};

export default ChartsTable;
