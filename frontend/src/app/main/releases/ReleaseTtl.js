import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import TtlModal from 'app/shared-components/TtlModal/TtlModal';
import { createReleaseTtl, deleteReleaseTtl } from 'app/store/releasesSlice';

const ReleaseTtl = ({ refresh, setRefresh, openModal, parameters }) => {
  const dispatch = useDispatch();
  const { currentDate, context_name, namespace, name } = parameters;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
    setInfoMessageSuccess('');
    setInfoMessageError('');
    setOpen(false);
    setLoading(false);
  };

  const showMessage = (res) => {
    if (res.status === 'success') {
      setInfoMessageSuccess(res.message);
    } else {
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
    <TtlModal
      open={open}
      handleSet={() => handleCreateReleaseTtl(context_name, namespace, name)}
      handleUnset={() => handleDeleteReleaseTtl(context_name, namespace, name)}
      handleClose={handleClose}
      currentDate={currentDate}
      getSelectedDate={getSelectedDate}
      loading={loading}
      infoMessageSuccess={infoMessageSuccess}
      infoMessageError={infoMessageError}
      disabled={disabled}
    />
  );
};
export default ReleaseTtl;
