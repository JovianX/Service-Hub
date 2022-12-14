import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  InputLabel,
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import MonacoEditor from '@uiw/react-monacoeditor';
import yaml from 'js-yaml';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { chartInstall, getDefaultValues, selectCharts } from 'app/store/chartsSlice';
import { getContextList, selectContexts } from 'app/store/clustersSlice';

import NamespacesSelect from './NamespacesSelect';
import VersionsSelect from './VersionsSelect';

const useStyles = makeStyles({
  button: {
    border: '2px solid transparent',
    borderRadius: 'none',
    '&:hover': {
      borderBottom: '2px solid #000',
    },
  },
});

const ChartsModal = ({ chartName, openModal }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingDefaultValues, setLoadingDefaultValues] = useState(false);
  const [open, setOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [cluster, setCluster] = useState('');
  const [namespace, setNamespace] = useState('');
  const [chartVersion, setChartVersion] = useState('');
  const [startVersion, setStartVersion] = useState('');
  const [chart, setChart] = useState({});
  const [defaultValuesParam, setDefaultValuesParam] = useState('');
  const [configYamlText, setConfigYamlText] = useState(null);
  const [defaultConfigYamlText, setDefaultConfigYamlText] = useState(null);
  const [editorHeight, setEditorHeight] = useState('150px');

  const chartData = useSelector(selectCharts);
  const clusterData = useSelector(selectContexts);

  useEffect(() => {
    dispatch(getContextList());
  }, [dispatch]);

  useEffect(() => {
    setOpen(true);
    const data = chartData.find((item) => item.name === chartName);
    setChart(data);
    setCluster(clusterData[0]?.name);
    openModal.setOpenModal(false);
    setConfigYamlText(null);
    setDefaultConfigYamlText(null);
    setEditorHeight('150px');
  }, [openModal.openModal]);

  useEffect(() => {
    if (chart?.name) {
      setDefaultValuesParam(chart.name);
      setChartVersion(chart.version);
    }
  }, [chart]);

  const getValue = (newValue) => {
    setConfigYamlText(newValue);
  };

  const onChangeDefaultValuesParam = (e) => {
    setDefaultValuesParam(e.target.value);
  };

  const handleGetDefaultValues = () => {
    setDefaultConfigYamlText(configYamlText);
    if (defaultValuesParam) {
      if (showMessage) {
        setShowMessage(false);
      }
      setLoadingDefaultValues(true);
      const nameList = defaultValuesParam.split('/');
      const fetchData = async () => {
        await dispatch(getDefaultValues({ repository_name: nameList[0], application_name: nameList[1] })).then(
          (res) => {
            if (res.payload?.status === 'error') {
              setShowMessage(true);
              setInfoMessageError(res.payload.message);
            } else {
              setDefaultConfigYamlText(res.payload);
              setEditorHeight('300px');
            }
            setLoadingDefaultValues(false);
          },
        );
      };
      fetchData();
    }
  };

  // modal actions
  const handleClickSaveButton = (e) => {
    e.preventDefault();
    setInfoMessageError('');
    setInfoMessageSuccess('');
    setLoading(true);
    if (e.target.form) {
      const { chart_name, description, release_name, context_name } = e.target.form;
      if (!chart_name.value || !description.value || !release_name.value || !configYamlText || !context_name.value) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    inputRef.current.click();
  };

  const handleSubmitInstall = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { chart_name, description, release_name, context_name } = e.target;
    try {
      const chart = {
        chart_name: chart_name.value,
        version: chartVersion,
        description: description.value,
        release_name: release_name.value,
        values: yaml.load(configYamlText, { json: true }),
        context_name: context_name.value,
        namespace,
      };
      if (showMessage) {
        setShowMessage(false);
      }
      const { payload } = await dispatch(chartInstall(chart));
      if (payload?.message) {
        await setLoading(false);
        await setShowMessage(true);
        await setInfoMessageError(payload.message);
        return;
      }
      if (payload?.detail) {
        await setLoading(false);
        await setShowMessage(true);
        await setInfoMessageError(`${payload.detail[0].loc[1]}: ${payload.detail[0].msg}`);
        return;
      }
      if (payload?.info.status) {
        await setInfoMessageSuccess('Helm chart installation was successful');
        await setShowMessage(true);
        await setLoading(false);
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (e) {
      await setLoading(false);
      await setShowMessage(true);
      await setInfoMessageError(e.reason);
    }
  };

  const handleClose = () => {
    setShowMessage(false);
    setOpen(false);
    setLoading(false);
    if (chartVersion) {
      setChartVersion('');
    }
    if (startVersion) {
      setStartVersion('');
    }
    setChart(null);
  };

  const handleChangeSelect = (e) => {
    setCluster(e.target.value);
  };

  const handleGetNamespace = (value) => {
    setNamespace(value);
  };

  return (
    <div>
      {chart && (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
          <form onSubmit={handleSubmitInstall}>
            <DialogTitle className='bg-primary text-center text-white'>Deploy new Helm release</DialogTitle>
            <DialogContent className='pb-0 mt-8 overflow-y-hidden'>
              {/* <div className='mt-24'>Deploy a new Helm release</div> */}
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
                name='description'
                type='text'
                id='outlined-required'
                label='Description'
                margin='normal'
                fullWidth
              />
              <TextField
                name='chart_name'
                type='text'
                required
                id='outlined-required'
                label='Chart'
                margin='normal'
                fullWidth
                defaultValue={chart.name}
                onChange={onChangeDefaultValuesParam}
              />
              <VersionsSelect
                chartName={chart.name}
                chartVersion={chartVersion}
                setChartVersion={setChartVersion}
                setStartVersion={setStartVersion}
                startVersion={startVersion}
              />
              <Box sx={{ minWidth: 120 }}>
                <FormControl margin='normal' fullWidth required>
                  <InputLabel id='cluster'>Cluster</InputLabel>
                  <Select
                    name='context_name'
                    labelId='cluster'
                    value={cluster}
                    required
                    label='Clusters'
                    onChange={handleChangeSelect}
                  >
                    {clusterData.map((cluster) => (
                      <MenuItem key={cluster.name} value={cluster.name}>
                        {cluster.cluster}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <NamespacesSelect
                clusterContextName={cluster}
                handleGetNamespace={(value) => handleGetNamespace(value)}
              />

              <div className='mt-24 flex items-end flex-col'>
                <LoadingButton
                  className={`${classes.button} p-0 pb-2 mb-4 hover:bg-inherit rounded-none  min-h-[20px] h-[20px]`}
                  onClick={handleGetDefaultValues}
                  loading={loadingDefaultValues}
                >
                  Load values from chart
                </LoadingButton>

                <MonacoEditor
                  value={defaultConfigYamlText || this}
                  height={editorHeight}
                  language='yaml'
                  onChange={getValue.bind(this)}
                  options={{ automaticLayout: true, theme: 'vs-dark' }}
                />
              </div>
            </DialogContent>
            <DialogActions className='p-24 justify-between'>
              <div className='mr-10'>
                {showMessage && (
                  <>
                    <div>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>
                    <div>{infoMessageSuccess && <p className='text-green'>{infoMessageSuccess}</p>}</div>
                  </>
                )}
              </div>
              <div className='flex'>
                <Button className='mr-14' onClick={handleClose}>
                  Cancel
                </Button>
                <LoadingButton
                  color='primary'
                  onClick={handleClickSaveButton}
                  loading={loading}
                  loadingPosition='start'
                  startIcon={<CloudUploadIcon />}
                  variant='contained'
                  disabled={loadingDefaultValues}
                >
                  Deploy
                </LoadingButton>
                <input ref={inputRef} type='submit' className='hidden' />
              </div>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </div>
  );
};

export default ChartsModal;
