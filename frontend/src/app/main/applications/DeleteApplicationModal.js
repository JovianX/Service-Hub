import { useState } from 'react';
import { useDispatch } from 'react-redux';

import DialogModal from 'app/shared-components/DialogModal';
import { deleteApplication } from 'app/store/applicationsSlice';

const DeleteApplicationModal = ({ options, setApplications, setAllApplications, setOpenDeleteModal }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(options.isOpenModal);

  const handleDeleteApplication = async (id) => {
    await dispatch(deleteApplication(id)).then((res) => {
      setApplications((applications) => [...applications.filter((item) => item.id !== id)]);
      setAllApplications((applications) => [...applications.filter((item) => item.id !== id)]);
      setOpenDeleteModal(false);
    });
  };

  const toggleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleCancel = () => {
    toggleModalOpen();
  };

  const handleConfirm = () => {
    toggleModalOpen();
    handleDeleteApplication(options.id);
  };

  return (
    <DialogModal
      isOpen={isModalOpen}
      onClose={handleCancel}
      title={options.title}
      text={options.text}
      onCancel={handleCancel}
      cancelText='Cancel'
      onConfirm={handleConfirm}
      confirmText={options.confirmText}
      fullWidth
    />
  );
};

export default DeleteApplicationModal;
