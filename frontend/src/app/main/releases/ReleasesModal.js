import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { createReleaseTtl, deleteReleaseTtl } from 'app/store/releasesSlice';

import { getReleaseTtl } from '../../api';

import ReleasesDatePicker from './ReleasesDatePicker';

const ReleasesModal = ({ setReceivedOneTtl, openModal, parameters }) => {
  const dispatch = useDispatch();
  const { ttlCellIndex, currentDate, context_name, namespace, name } = parameters;
  const [open, setOpen] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');

  const [selectedDate, getSelectedDate] = useState('');

  useEffect(() => {
    if (openModal.openModal) {
      setOpen(true);
      openModal.setOpenModal(false);
    }
  }, [openModal.openModal]);

  // modal actions
  const handleClose = () => {
    setShowErrorMessage(false);
    setShowSuccessMessage(false);
    setOpen(false);
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
  };

  const handleCreateReleaseTtl = async (context_name, namespace, name) => {
    const selectedDateUnix = new Date(selectedDate);
    const selectedUnixTimestamp = selectedDateUnix.getTime();
    const timestamp = Date.now();

    let minutes = 0;
    if (selectedUnixTimestamp) {
      minutes = Math.round((selectedUnixTimestamp - timestamp) / 1000 / 60);
    }

    await dispatch(createReleaseTtl({ context_name, namespace, name, minutes })).then((res) => {
      showMessage(res.payload);
    });
    await getReleaseTtl(context_name, namespace, name).then((res) => {
      setReceivedOneTtl((ttl) => ({ ...ttl, timestamp: res.data.scheduled_time, ttlCellIndex }));
    });
  };

  const handleDeleteReleaseTtl = async (context_name, namespace, name) => {
    await dispatch(deleteReleaseTtl({ context_name, namespace, name })).then((res) => {
      showMessage(res.payload);
    });
    await getReleaseTtl(context_name, namespace, name).then((res) => {
      setReceivedOneTtl((ttl) => ({ ...ttl, timestamp: res.data.scheduled_time, ttlCellIndex }));
    });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle className='bg-primary text-center text-white mb-24'>Change TTL</DialogTitle>
        <DialogContent>
          <div className='pt-24 flex justify-center'>
            <ReleasesDatePicker currentDate={currentDate || ''} getSelectedDate={getSelectedDate} />
          </div>
        </DialogContent>
        <DialogActions className='p-24 pb-0 justify-between'>
          <Button
            color='error'
            variant='contained'
            className='mr-14'
            onClick={() => handleDeleteReleaseTtl(context_name, namespace, name)}
          >
            Delete
          </Button>
          <div>
            <Button className='mr-14' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              className='mr-14'
              onClick={() => handleCreateReleaseTtl(context_name, namespace, name)}
            >
              Save
            </Button>
          </div>
        </DialogActions>
        <div className='p-24 min-h-[70px]'>
          {showErrorMessage && <div>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>}
          {showSuccessMessage && <div>{infoMessageSuccess && <p className='text-green'>{infoMessageSuccess}</p>}</div>}
        </div>
      </Dialog>
    </div>
  );
};
export default ReleasesModal;
