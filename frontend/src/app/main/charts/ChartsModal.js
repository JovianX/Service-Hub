import SaveIcon from '@mui/icons-material/Save';
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
import { Box } from '@mui/system';
import yaml from 'js-yaml';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { chartInstall, selectCharts } from 'app/store/chartsSlice';
import { getClustersList, selectClusters } from 'app/store/clustersSlice';

import NamespacesSelect from './NamespacesSelect';

const ChartsModal = ({ setInfoMessageSuccess, chartName, openModal }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [cluster, setCluster] = useState('');
  const [namespace, setNamespace] = useState('');
  const [chart, setChart] = useState({});

  const chartData = useSelector(selectCharts);
  const clusterData = useSelector(selectClusters);

  useEffect(() => {
    dispatch(getClustersList());
  }, [dispatch]);

  useEffect(() => {
    setOpen(true);
    const data = chartData.find((item) => item.name === chartName);
    setChart(data);
    openModal.setOpenModal(false);
  }, [openModal.openModal]);

  // modal actions
  const handleClickSaveButton = (e) => {
    e.preventDefault();
    setInfoMessageError('');
    setInfoMessageSuccess('');
    setLoading(true);
    if (e.target.form) {
      const { chart_name, version, description, release_name, values, context_name } = e.target.form;

      if (
        !chart_name.value ||
        !version.value ||
        !description.value ||
        !release_name.value ||
        !values.value ||
        !context_name.value
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
        setShowErrorMessage(false);
      }
      const data = await dispatch(chartInstall(chart));
      if (data.payload?.message) {
        await setLoading(false);
        await setShowErrorMessage(true);
        await setInfoMessageError(data.payload.message);
        return;
      }
      if (data.payload?.detail) {
        await setLoading(false);
        await setShowErrorMessage(true);
        await setInfoMessageError(`${data.payload.detail[0].loc[1]}: ${data.payload.detail[0].msg}`);
        return;
      }
      if (data.payload.info.status) {
        await setInfoMessageSuccess('Helm chart installation was successful');
        await setOpen(false);
        await setLoading(false);
      }
    } catch (e) {
      await setShowErrorMessage(true);
      await setLoading(false);
      await setInfoMessageError(e.reason);
    }
  };

  const handleClose = () => {
    setShowErrorMessage(false);
    setOpen(false);
    setLoading(false);
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
                defaultValue={chart.version}
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
                clusterContextName={cluster}
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
              <div>{showErrorMessage && infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>
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
      )}
    </div>
  );
};

export default ChartsModal;
