import { useState } from 'react';
import { useDispatch } from 'react-redux';

import DialogModal from 'app/shared-components/DialogModal';
import { changeAccessTokenStatus } from 'app/store/accessTokensSlice';

const AccessTokenStatusModal = ({ statusModalInfo, setStatusModalInfo }) => {
  const dispatch = useDispatch();
  const { open, token, status } = statusModalInfo;
  const [isModalOpen, setIsModalOpen] = useState(open);

  const toggleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
    setStatusModalInfo((statusModalInfo) => ({ ...statusModalInfo, open: false }));
  };
  const handleCancel = () => {
    toggleModalOpen();
  };
  const handleConfirm = () => {
    dispatch(changeAccessTokenStatus({ token, status: status === 'active' ? 'disabled' : 'active' }));
    toggleModalOpen();
  };

  return (
    <DialogModal
      isOpen={isModalOpen}
      onClose={handleCancel}
      title={status === 'active' ? `Deactivate token ${token}` : `Activate token ${token}`}
      text='Are you sure you want to proceed?'
      onCancel={handleCancel}
      cancelText='Cancel'
      onConfirm={handleConfirm}
      confirmText={status === 'active' ? 'Deactivate' : 'Activate'}
      fullWidth
    />
  );
};

export default AccessTokenStatusModal;
