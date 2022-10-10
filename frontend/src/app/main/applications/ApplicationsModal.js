import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { applicationInstall } from 'app/store/applicationsSlice';

import NamespacesSelect from './NamespacesSelect';
import TemplatesSelect from './TemplatesSelect';

const ApplicationsModal = ({ openModal, setOpenModal, kubernetesConfiguration }) => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [cluster, setCluster] = useState('');
  const [namespace, setNamespace] = useState('');

  useEffect(() => {
    setCluster(kubernetesConfiguration[0]?.name);
  }, [kubernetesConfiguration]);

  useEffect(() => {
    if (openModal) {
      setOpen(true);
      setOpenModal(false);
    }
  }, [openModal]);

  const handleClickSaveButton = (e) => {
    e.preventDefault();
    setInfoMessageError('');
    setInfoMessageSuccess('');
    setLoading(true);
    inputRef.current.click();
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };

  const handleSubmitInstall = async (e) => {
    e.preventDefault();
    const { template_id, inputs, context_name } = e.target;
    const application = {
      template_id,
      inputs,
      context_name,
      namespace,
      dry_run: false,
    };
    const data = await dispatch(applicationInstall(application));
  };

  const handleChangeSelect = (e) => {
    setCluster(e.target.value);
  };

  const handleGetNamespace = (value) => {
    setNamespace(value);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <form onSubmit={handleSubmitInstall}>
          <DialogTitle className='bg-primary text-center text-white'>Create Application</DialogTitle>
          <DialogContent className='pb-0  overflow-y-hidden'>
            <div className='mt-24'>Create a new applicaion</div>
            <TemplatesSelect />
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
                  {kubernetesConfiguration.length &&
                    kubernetesConfiguration?.map((cluster) => (
                      <MenuItem key={cluster.name} value={cluster.name}>
                        {cluster.cluster}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <NamespacesSelect clusterContextName={cluster} handleGetNamespace={(value) => handleGetNamespace(value)} />
          </DialogContent>

          <DialogActions className='p-24 justify-between'>
            <div className='mr-10'>
              <div>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>
              <div>{infoMessageSuccess && <p className='text-green'>{infoMessageSuccess}</p>}</div>
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
                Create
              </LoadingButton>
              <input ref={inputRef} type='submit' className='hidden' />
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ApplicationsModal;
