import { useState } from 'react';
import { useDispatch } from 'react-redux';

import DialogModal from 'app/shared-components/DialogModal';
import { deleteAccessToken } from 'app/store/accessTokensSlice';

const DeleteAccessTokenModal = ({ deleteModalInfo, setDeleteModalInfo }) => {
  const dispatch = useDispatch();
  const { open, token } = deleteModalInfo;
  const [isModalOpen, setIsModalOpen] = useState(open);

  const toggleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
    setDeleteModalInfo((deleteModalInfo) => ({ ...deleteModalInfo, open: false }));
  };

  const handleCancel = () => {
    toggleModalOpen();
  };
  const handleConfirm = () => {
    dispatch(deleteAccessToken(token));
    toggleModalOpen();
  };

  return (
    <DialogModal
      isOpen={isModalOpen}
      onClose={handleCancel}
      title={`Delete token ${token}`}
      text='Are you sure you want to proceed?'
      onCancel={handleCancel}
      cancelText='Cancel'
      onConfirm={handleConfirm}
      confirmText='Delete'
      fullWidth
    />
  );
};

export default DeleteAccessTokenModal;
