import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { createReleaseTtl, deleteReleaseTtl } from 'app/store/releasesSlice';

import ReleasesDatePicker from './ReleasesDatePicker';

const ReleasesModal = ({ refresh, setRefresh, openModal, parameters }) => {
  const dispatch = useDispatch();
  const { currentDate, context_name, namespace, name } = parameters;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [selectedDate, getSelectedDate] = useState('');
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (openModal.openModal) {
      setOpen(true);
      openModal.setOpenModal(false);
    }
  }, [openModal.openModal]);

  useEffect(() => {
    if (currentDate) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [currentDate]);

  const handleClose = () => {
    setShowErrorMessage(false);
    setShowSuccessMessage(false);
    setOpen(false);
    setLoading(false);
  };

  const showMessage = (res) => {
    if (res.status === 'success') {
      setShowErrorMessage(false);
      setShowSuccessMessage(true);
      setInfoMessageSuccess(res.message);
    } else {
      setShowSuccessMessage(false);
      setShowErrorMessage(true);
      setInfoMessageError(res.message);
    }
    setLoading(false);
  };

  const handleCreateReleaseTtl = async (context_name, namespace, name) => {
    setLoading(true);
    const selectedDateUnix = new Date(selectedDate);
    const selectedUnixTimestamp = selectedDateUnix.getTime();
    const timestamp = Date.now();

    let minutes = 0;
    if (selectedUnixTimestamp) {
      minutes = Math.round((selectedUnixTimestamp - timestamp) / 1000 / 60);
    }

    await dispatch(createReleaseTtl({ context_name, namespace, name, minutes })).then((res) => {
      setDisabled(false);
      showMessage(res.payload);
      setTimeout(() => {
        handleClose();
      }, 2000);
    });
    await setRefresh(!refresh);
  };

  const handleDeleteReleaseTtl = async (context_name, namespace, name) => {
    await dispatch(deleteReleaseTtl({ context_name, namespace, name })).then((res) => {
      setDisabled(true);
      showMessage(res.payload);
      setTimeout(() => {
        handleClose();
      }, 2000);
    });
    await setRefresh(!refresh);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle className='bg-primary text-center text-white mb-24'>Set TTL</DialogTitle>
        <DialogContent>
          <div>
            <div className='mb-24'>Set scheduled deletion of the helm release:</div>
          </div>
          <div>
            <ReleasesDatePicker currentDate={currentDate} getSelectedDate={getSelectedDate} />
          </div>
        </DialogContent>
        <DialogActions className='p-24 pt-4 justify-between'>
          <div className='flex items-center'>
            <Button
              disabled={disabled}
              color='error'
              variant='contained'
              className='mr-14'
              onClick={() => handleDeleteReleaseTtl(context_name, namespace, name)}
            >
              Unset TTL
            </Button>
            <div>
              {showErrorMessage && <div>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>}
              {showSuccessMessage && (
                <div>{infoMessageSuccess && <p className='text-green'>{infoMessageSuccess}</p>}</div>
              )}
            </div>
          </div>

          <div>
            <Button className='mr-14' onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              color='primary'
              onClick={() => handleCreateReleaseTtl(context_name, namespace, name)}
              loading={loading}
              loadingPosition='start'
              startIcon={<SaveIcon />}
              variant='contained'
            >
              Save
            </LoadingButton>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ReleasesModal;
