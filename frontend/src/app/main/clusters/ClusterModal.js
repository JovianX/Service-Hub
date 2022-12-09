import AddIcon from '@mui/icons-material/Add';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MonacoEditor from '@uiw/react-monacoeditor';
import yaml from 'js-yaml';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { uploadConfiguration, getContextList } from 'app/store/clustersSlice';

import { kubeconfigUrl } from '../../constants/kubeconfigUrl';

const options = {
  readOnly: false,
  automaticLayout: false,
  padding: {
    top: 10,
    bottom: 10,
  },
  theme: 'vs-dark',
};

const ClusterModal = ({ openModal }) => {
  const dispatch = useDispatch();
  const copyInputRef = useRef(null);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [configYamlText, setConfigYamlText] = useState(
      'kind: Config\n' +
      'apiVersion: v1\n' +
      'current-context: example-context\n' +
      'clusters:\n' +
      '- cluster:\n' +
      '    certificate-authority-data: dG9rZW4=\n' +
      '    server: https://42.42.42.42\n' +
      '  name: example-cluster\n' +
      'contexts:\n' +
      '- context:\n' +
      '    cluster: example-cluster\n' +
      '    namespace: example-namespace\n' +
      '    user: example-user\n' +
      '  name: example-context\n' +
      'users:\n' +
      '- user:\n' +
      '    token: example-user-token\n' +
      '  name: example-user\n' +
      'preferences: {}',
  );

  useEffect(() => {
    if (openModal.openModal) {
      setOpen(true);
      openModal.setOpenModal(false);
    }
  }, [openModal.openModal]);

  const getValue = (newValue) => {
    setConfigYamlText(newValue);
  };

  const handleClickOpenSnackbar = () => {
    setOpenSnackbar(true);
    navigator.clipboard.writeText(copyInputRef.current.value);
  };

  // modal actions
  const handleClickSaveButton = (e) => {
    e.preventDefault();
    setInfoMessageError('');
    setInfoMessageSuccess('');
    setLoading(true);
    if (!configYamlText) {
      setLoading(false);
      return;
    }
    inputRef.current.click();
  };

  const handleSubmitInstall = async (e) => {
    e.preventDefault();
    if (configYamlText) {
      try {
        if (showMessage) {
          setShowMessage(false);
        }
        const configuration = yaml.load(configYamlText, { json: true });
        const data = await dispatch(uploadConfiguration(configuration));
        if (data.payload?.message) {
          await setLoading(false);
          await setShowMessage(true);
          await setInfoMessageError(data.payload.message);
          return;
        }
        if (data.payload?.detail) {
          await setLoading(false);
          await setShowMessage(true);
          await setInfoMessageError(`${data.payload.detail[0].loc[1]}: ${data.payload.detail[0].msg}`);
          return;
        }
        if (data.payload?.current_context) {
          await setInfoMessageSuccess('The organization\'s Kubernetes configuration download was successful');
          await setShowMessage(true);
          await setLoading(false);
          await dispatch(getContextList());
        }
      } catch (e) {
        await setLoading(false);
        await setShowMessage(true);
        await setInfoMessageError(e.reason);
      }
    }
  };

  const handleClose = () => {
    setShowMessage(false);
    setOpen(false);
    setLoading(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
        <form onSubmit={handleSubmitInstall}>
          <DialogTitle className='bg-primary text-center text-white'>Add Kubernetes cluster</DialogTitle>
          <DialogContent className='p-0 min-h-[520px] overflow-y-hidden'>
            <div className='grid grid-cols-[1fr_4fr] grid-rows-[1fr_3fr] place-items-stretch'>
              <div className='border-r-2 p-24'>
                <p>Kubectl</p>
              </div>
              <div className='border-b-2 p-24 relative'>
                <Typography component='h3' className='mb-8'>
                  Copy the command below (to connect to a Kubernetes cluster via kubectl):
                </Typography>
                <div className='flex items-center bg-black'>
                  <TextField
                    inputRef={copyInputRef}
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                      spellCheck: 'false',
                    }}
                    fullWidth
                    onFocus={(event) => {
                      event.target.select();
                    }}
                    onChange={(event) => {
                      event.target.value = kubeconfigUrl;
                    }}
                    defaultValue={kubeconfigUrl}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'primary.light',
                      },
                    }}
                  />
                  <IconButton aria-label='copy' size='large' className='text-white' onClick={handleClickOpenSnackbar}>
                    <FileCopyIcon />
                  </IconButton>
                  <Snackbar
                    open={openSnackbar}
                    onClose={() => setOpenSnackbar(false)}
                    autoHideDuration={2000}
                    message='Copied to clipboard'
                  />
                </div>
                <Typography component='h3' className='my-8'>
                  Paste and run command in a terminal where Kubectl is configured.
                </Typography>
                <Stack direction='row' spacing={1} className='absolute bg-white right-[44%] bottom-[-18px]'>
                  <Chip label='OR' className='text-2xl text-gray px-20 border-b-40 ' />
                </Stack>
              </div>

              <div className='p-24 border-r-2'>
                <p>Paste kubeconfig</p>
              </div>

              <div className='p-24 pb-0'>
                <Typography component='h3' className='my-8'>
                  Paste a kubeconfig file to add a Kubernetes cluster (generated by <a target="_new" href="https://github.com/JovianX/kubectl-kubeconfig">kubectl-kubeconfig</a>)
                </Typography>
                <MonacoEditor
                  value={configYamlText}
                  height='400px'
                  name='values'
                  language='yaml'
                  options={options}
                  onChange={getValue.bind(this)}
                />

                <div className='mt-20'>
                  {showMessage && (
                    <>
                      <div className=''>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions className='p-24 justify-between'>
            <div className='mr-10	'>
              {showMessage && (
                <>
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
                startIcon={<AddIcon />}
                variant='contained'
              >
                Add
              </LoadingButton>
              <input ref={inputRef} type='submit' className='hidden' />
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ClusterModal;
