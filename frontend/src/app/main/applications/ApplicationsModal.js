import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { applicationInstall } from 'app/store/applicationsSlice';

import { PATHS } from '../../constants/paths';

import TemplateInputs from './TemplateInputs/TemplateInputs';

const ApplicationsModal = ({ openModal, setOpenModal, kubernetesConfiguration, templateFromCatalog }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [namespace] = useState('');
  const [templateFormData, setTemplateFormData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (openModal) {
      setOpen(true);
      setOpenModal(false);
    }
  }, [openModal]);

  const clearMessages = () => {
    setInfoMessageError('');
    setInfoMessageSuccess('');
  };

  const handleSubmitInstall = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    const { context_name, template_id } = e.target;
    const application = {
      template_id: template_id.value,
      inputs: templateFormData,
      context_name: context_name.value,
      ttl: {
        minutes: 0,
      },
      namespace,
      dry_run: false,
    };
    const { payload } = await dispatch(applicationInstall(application));
    if (payload.status === 'error') {
      setInfoMessageError(payload.message);
    } else {
      setInfoMessageSuccess('Service was successfully created');

      navigate(`/${PATHS.APPLICATIONS}/${payload.application.id}`, {
        state: {
          row: payload.application,
        },
      });

      setTimeout(() => {
        setOpen(false);
        clearMessages();
      }, 2000);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
    clearMessages();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <form onSubmit={handleSubmitInstall}>
          <DialogTitle className='bg-primary text-center text-white'>Create Service</DialogTitle>
          <DialogContent className='pb-0  overflow-y-hidden'>
            <div className='mt-24'>Create a new service</div>
            <TemplateInputs
              setTemplateFormData={setTemplateFormData}
              clearMessages={clearMessages}
              templateFromCatalog={templateFromCatalog}
              kubernetesConfiguration={kubernetesConfiguration}
            />
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
                type='submit'
                color='primary'
                loading={loading}
                loadingPosition='start'
                startIcon={<AddIcon />}
                variant='contained'
              >
                Create
              </LoadingButton>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ApplicationsModal;
