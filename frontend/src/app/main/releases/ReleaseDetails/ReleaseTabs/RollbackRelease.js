import ReplyIcon from '@mui/icons-material/Reply';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import SnackbarMessage from 'app/shared-components/Snackbar';
import { getHemlReleaseHistory } from 'app/store/releaseSlice';

import { rollbackRelease } from '../../../../api';

const RollbackRelease = ({ revision, contextName, namespace, name }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState({
    status: '',
    message: '',
  });

  const handleRollbackRelease = async () => {
    await setLoading(true);
    const requestBody = {
      context_name: contextName,
      namespase: namespace,
      revision,
      dry_run: false,
    };
    const rollbackData = await rollbackRelease(name, requestBody);

    if (rollbackData.status === 200) {
      await dispatch(
        getHemlReleaseHistory({
          context_name: contextName,
          namespace,
          release_name: name,
        }),
      );
      await setShowMessage(true);
      await setSnackbarInfo({ status: 'success', message: rollbackData.data });
    } else {
      await setShowMessage(true);
      await setSnackbarInfo({ status: 'error', message: 'Rollback failed' });
    }

    await setLoading(false);
  };
  return (
    <>
      <LoadingButton variant='text' color='primary' loading={loading} onClick={handleRollbackRelease}>
        <FuseSvgIcon>
          heroicons-outline:reply
        </FuseSvgIcon>
      </LoadingButton>

      <SnackbarMessage
        status={snackbarInfo?.status}
        message={snackbarInfo?.message}
        showMessage={showMessage}
        setShowMessage={setShowMessage}
      />
    </>
  );
};

export default RollbackRelease;
