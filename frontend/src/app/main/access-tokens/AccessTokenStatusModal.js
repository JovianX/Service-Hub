import { useState } from 'react';

import DialogModal from 'app/shared-components/DialogModal';

const AccessTokenStatusModal = ({ statusModalInfo, setStatusModalInfo }) => {
  const { open, id, status } = statusModalInfo;
  const [isModalOpen, setIsModalOpen] = useState(open);

  const toggleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleCancel = () => {
    toggleModalOpen();
    setStatusModalInfo((statusModalInfo) => ({ ...statusModalInfo, open: false }));
  };
  const handleConfirm = () => {
    toggleModalOpen();
  };

  return (
    <DialogModal
      isOpen={isModalOpen}
      onClose={handleCancel}
      title={status === 'active' ? `Deactivate token ${id}` : `Activate token ${id}`}
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
