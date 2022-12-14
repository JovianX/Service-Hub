import AddIcon from '@mui/icons-material/Add';
import { CardActions, CardContent, Chip } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DialogModal from 'app/shared-components/DialogModal';
import {
  deleteContext,
  getContextList,
  selectContexts,
  selectDefaultContext,
  selectIsContextsLoading,
} from 'app/store/clustersSlice';

import { checkTrimString } from '../../uitls';

import ClusterModal from './ClusterModal';

const ClustersBlocks = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const contextData = useSelector(selectContexts);
  const isLoading = useSelector(selectIsContextsLoading);
  const defaultContext = useSelector(selectDefaultContext);

  useEffect(() => {
    dispatch(getContextList());
  }, [dispatch]);

  useEffect(() => {
    if (location?.state?.openModal) {
      setOpenModal(true);
      navigate('', {});
    }
  }, [location]);

  const [contextToDelete, setContextToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const toggleDeleteModalOpen = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleDeleteContext = (context) => {
    setContextToDelete(context);

    toggleDeleteModalOpen();
  };

  const handleDeleteCancel = () => {
    toggleDeleteModalOpen();
    setContextToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteContext(contextToDelete));
    toggleDeleteModalOpen();
    setContextToDelete(null);
    await dispatch(getContextList());
  };

  const renderClusters = () => {
    return contextData?.map(({ region, name, cluster, cloud_provider }) => (
      <Card key={name} className='flex flex-col h-320 shadow w-320 mr-24'>
        <CardContent className='flex flex-col flex-auto p-24'>
          <div className='w-full'>
            <div className='flex items-center justify-between mb-16'>
              {region && <Chip className='font-semibold text-12' label={region} size='small' />}

              {name === defaultContext && (
                <FuseSvgIcon className='text-green-600' size={20}>
                  heroicons-solid:badge-check
                </FuseSvgIcon>
              )}
            </div>

            <Typography className='text-16 font-medium'>Cluster: {checkTrimString(cluster, 40, 15)}</Typography>

            <Typography className='text-13 mt-2 line-clamp-2' color='text.secondary'>
              Context: {checkTrimString(name, 40, 15) || '-'}
            </Typography>
          </div>

          <Typography className='flex items-center space-x-6 text-13 mt-24' color='text.secondary'>
            <FuseSvgIcon color='disabled' size={20}>
              heroicons-outline:cloud
            </FuseSvgIcon>
            <span className='whitespace-nowrap leading-none'>Cloud provider: {cloud_provider || '-'}</span>
          </Typography>

          <Typography className='flex items-center space-x-6 text-13 mt-8' color='text.secondary'>
            <FuseSvgIcon color='disabled' size={20}>
              heroicons-outline:globe
            </FuseSvgIcon>
            <span className='whitespace-nowrap leading-none'>Region: {region || '-'}</span>
          </Typography>
        </CardContent>

        {name && (
          <CardActions className='items-center justify-end px-24'>
            <Button onClick={() => handleDeleteContext(name)} variant='outlined' color='error'>
              <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
            </Button>
          </CardActions>
        )}
      </Card>
    ));
  };

  if (isLoading) {
    return (
      <div className='w-full flex flex-col min-h-full'>
        <FuseLoading />
      </div>
    );
  }

  return (
    <>
      <div className='min-h-[70px] m-12 flex justify-end items-center'>
        <Button
          className='mx-16'
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          Add Kubernetes cluster
        </Button>
        <ClusterModal openModal={{ openModal, setOpenModal }} />
      </div>
      <div className='w-full flex p-24 justify-start'>{renderClusters()}</div>

      <DialogModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        title={`Delete context ${checkTrimString(contextToDelete, 30, 10)}`}
        text='Are you sure you want to proceed?'
        onCancel={handleDeleteCancel}
        cancelText='Cancel'
        onConfirm={handleDeleteConfirm}
        confirmText='Delete'
        fullWidth
      />
    </>
  );
};

export default ClustersBlocks;
