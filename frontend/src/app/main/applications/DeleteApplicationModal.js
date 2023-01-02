import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DialogModal from 'app/shared-components/DialogModal';
import { deleteApplication } from 'app/store/applicationsSlice';

const DeleteApplicationModal = ({ options, setOpenDeleteModal }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(options.isOpenModal);
  const navigate = useNavigate();

  const handleDeleteApplication = (id) => {
    if (options.is_application_page) {
      navigate(-1);
    }
    dispatch(deleteApplication(id));
    setOpenDeleteModal(false);
  };

  const toggleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCancel = () => {
    toggleModalOpen();
    setOpenDeleteModal(false);
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
