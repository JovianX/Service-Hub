import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import TtlModal from 'app/shared-components/TtlModal/TtlModal';
import { getApplicationsList, setApplicationTtl } from 'app/store/applicationsSlice';

const ApplicationTtl = ({ openTtlModal, setOpenTtlModal, parameters }) => {
  const dispatch = useDispatch();
  const { id, currentDate } = parameters;
  const [open, setOpen] = useState(false);
  const [selectedDate, getSelectedDate] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');

  useEffect(() => {
    if (openTtlModal) {
      setOpen(true);
      setOpenTtlModal(false);
    }
  }, [openTtlModal]);

  useEffect(() => {
    if (currentDate) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [currentDate, id]);

  const showMessage = (res) => {
    if (res.status === 'success') {
      setInfoMessageSuccess(res.message);
    } else {
      setInfoMessageError(res.message);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setInfoMessageSuccess('');
    setInfoMessageError('');
    setOpen(false);
    setLoading(false);
  };

  const requestForApplicationTll = (id, hours) => {
    dispatch(setApplicationTtl({ id, hours })).then((res) => {
      dispatch(getApplicationsList());
      setDisabled(false);
      showMessage(res.payload);
      setTimeout(() => {
        handleClose();
      }, 2000);
    });
  };

  const handleSetApplicationTtl = async () => {
    setLoading(true);
    const selectedDateUnix = new Date(selectedDate);
    const selectedUnixTimestamp = selectedDateUnix.getTime();
    const timestamp = Date.now();

    let minutes = {};
    if (selectedUnixTimestamp) {
      minutes = { minutes: Math.round((selectedUnixTimestamp - timestamp) / 1000 / 60) };
    }

    await requestForApplicationTll(id, minutes);
  };

  const handleUnsetApplicationTtl = async () => {
    const minutes = { minutes: 0 };
    await requestForApplicationTll(id, minutes);
  };

  return (
    <TtlModal
      open={open}
      handleSet={handleSetApplicationTtl}
      handleUnset={handleUnsetApplicationTtl}
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
export default ApplicationTtl;
