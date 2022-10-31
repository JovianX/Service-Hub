import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DialogModal from 'app/shared-components/DialogModal';
import { deleteRelease, getReleases } from 'app/store/releasesSlice';

const ReleasesDeleteModal = ({ options, openDeleteModal, setOpenDeleteModal, openDeleteInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteRelease = async (releaseData) => {
    await dispatch(deleteRelease(releaseData));
    if (options.is_release_page) {
      navigate(-1);
    }
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
