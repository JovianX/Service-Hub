import FileCopyIcon from '@mui/icons-material/FileCopy';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MonacoEditor from '@uiw/react-monacoeditor';
import yaml from 'js-yaml';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { uploadConfiguration, getContextList } from 'app/store/clustersSlice';

const options = {
  readOnly: false,
  automaticLayout: false,
  theme: 'hc-black',
  scrollbar: {
    useShadows: false,
    verticalHasArrows: true,
    horizontalHasArrows: true,
    vertical: 'visible',
    horizontal: 'visible',
    verticalScrollbarSize: 17,
    horizontalScrollbarSize: 17,
    arrowSize: 30,
  },
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
  const [configYamlText, setConfigYamlText] = useState('');

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
          <DialogTitle className='bg-primary text-center text-white'>Add new cluster</DialogTitle>
          <DialogContent className='p-0 min-h-[520px] overflow-y-hidden'>
            <div className='grid grid-cols-[1fr_4fr] grid-rows-[1fr_3fr] place-items-stretch'>
              <div className='border-r-2 p-24 text-gray'>
                <p>via CLI</p>
              </div>

              <div className='border-b-2 p-24 relative'>
                <Typography component='h3' className='mb-8 text-gray'>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit
                </Typography>
                <div className='flex items-center bg-black'>
                  <TextField
                    inputRef={copyInputRef}
                    fullWidth
                    disabled
                    defaultValue='curl -s https://service-hub-application-rn5pfez6gq-uc.a.run.app/docs#/organizations/upload_configuration_api_v1_organization_kubernetes_configuration_post'
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
                <Stack direction='row' spacing={1} className='absolute bg-white right-[44%] bottom-[-18px]'>
                  <Chip label='Or' className='text-3xl text-gray px-14' />
                </Stack>
              </div>

              <div className='p-24 border-r-2 text-gray'>
                <p>paste kubeconfig</p>
              </div>

              <div className='p-24 pb-0'>
                <Typography component='h3' className='mb-8 text-gray'>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit
                </Typography>
                <MonacoEditor
                  height='400px'
                  name='values'
                  language='yaml'
                  options={options}
                  onChange={getValue.bind(this)}
                />
              </div>
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
                startIcon={<SaveIcon />}
                variant='contained'
              >
                Save
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
