import { CardActions, CardContent, Chip } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
  getClustersList,
  selectClusters,
  selectDefaultContext,
  selectIsClustersLoading,
} from 'app/store/clustersSlice';

import { checkTrimString } from '../../uitls';

const ClustersBlocks = () => {
  const dispatch = useDispatch();

  const clusterData = useSelector(selectClusters);
  const isLoading = useSelector(selectIsClustersLoading);
  const defaultContext = useSelector(selectDefaultContext);

  useEffect(() => {
    dispatch(getClustersList());
  }, [dispatch]);

  const renderClusters = () => {
    return clusterData?.map((cluster) => (
      <Card key={cluster.name} className='flex flex-col h-320 shadow w-320 mr-24'>
        <CardContent className='flex flex-col flex-auto p-24'>
          <div className='w-full'>
            <div className='flex items-center justify-between mb-16'>
              <Chip className='font-semibold text-12' label={cluster.region} size='small' />

              {cluster.contextName === defaultContext && (
                <FuseSvgIcon className='text-green-600' size={20}>
                  heroicons-solid:badge-check
                </FuseSvgIcon>
              )}
            </div>

            <Typography className='text-16 font-medium'>Cluster: {checkTrimString(cluster.name, 40, 15)}</Typography>

            <Typography className='text-13 mt-2 line-clamp-2' color='text.secondary'>
              Context: {checkTrimString(cluster.contextName, 40, 15)}
            </Typography>
          </div>

          <Typography className='flex items-center space-x-6 text-13 mt-24' color='text.secondary'>
            <FuseSvgIcon color='disabled' size={20}>
              heroicons-outline:cloud
            </FuseSvgIcon>
            <span className='whitespace-nowrap leading-none'>Cloud provider: {cluster.cloud_provider}</span>
          </Typography>

          <Typography className='flex items-center space-x-6 text-13 mt-8' color='text.secondary'>
            <FuseSvgIcon color='disabled' size={20}>
              heroicons-outline:globe
            </FuseSvgIcon>
            <span className='whitespace-nowrap leading-none'>Region: {cluster.region}</span>
          </Typography>
        </CardContent>

        <CardActions className='items-center justify-end px-24'>
          <Button variant='outlined' color='error'>
            <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
          </Button>
        </CardActions>
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

  return <div className='w-full flex p-24 justify-start'>{renderClusters()}</div>;
};

export default ClustersBlocks;
