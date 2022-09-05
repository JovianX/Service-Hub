import { useState } from 'react';

import DialogModal from 'app/shared-components/DialogModal';

const UserDialogModal = ({ options }) => {
  const [isModalOpen, setIsModalOpen] = useState(options.isOpenModal);

  const toggleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleCancel = () => {
    toggleModalOpen();
  };
  const handleConfirm = () => {
    toggleModalOpen();
    options.action(options.id);
  };

  return (
    <DialogModal
      isOpen={isModalOpen}
      onClose={handleCancel}
      title={options.title}
      text='Are you sure you want to proceed?'
      onCancel={handleCancel}
      cancelText='Cancel'
      onConfirm={handleConfirm}
      confirmText={options.confirmText}
      fullWidth
    />
  );
};

export default UserDialogModal;
