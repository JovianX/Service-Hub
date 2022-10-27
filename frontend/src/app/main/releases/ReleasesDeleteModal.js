import { useDispatch } from 'react-redux';

import DialogModal from 'app/shared-components/DialogModal';
import { deleteRelease, getReleases } from 'app/store/releasesSlice';

const ReleasesDeleteModal = ({ options, openDeleteModal, setOpenDeleteModal, openDeleteInfo }) => {
  const dispatch = useDispatch();

  const handleDeleteRelease = async (releaseData) => {
    await dispatch(deleteRelease(releaseData));
    await dispatch(getReleases());
    setOpenDeleteModal(false);
  };

  const toggleModalOpen = () => {
    setOpenDeleteModal(!openDeleteModal);
  };
  const handleCancel = () => {
    toggleModalOpen();
  };

  const handleConfirm = () => {
    toggleModalOpen();
    handleDeleteRelease(openDeleteInfo);
  };

  return (
    <DialogModal
      isOpen={openDeleteModal}
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

export default ReleasesDeleteModal;
