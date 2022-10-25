import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Deployments from './Deployments';

const KubernetesResourcesTab = () => {
  const BoxStyles = {
    border: 1,
    borderColor: 'divider',
    padding: 2,
  };

  return (
    <Box>
      <Box sx={[BoxStyles, { height: '150px' }]} display='flex'>
        <Box className='mr-48'>
          <Typography variant='subtitle1'>Pods</Typography>
          <Typography variant='caption' display='block'>
            Nginx
          </Typography>
        </Box>
        <Box>
          <Typography variant='subtitle1'>Status</Typography>
          <Typography variant='caption' display='block'>
            True True 1
          </Typography>
        </Box>
      </Box>

      <Box sx={{ minHeight: 500 }} display='flex' gap='12px' className='mt-12'>
        <Box sx={{ width: '100%' }}>
          <Box sx={[BoxStyles, { height: '300px' }]}>
            <Deployments />
          </Box>
          <Box sx={[BoxStyles, { height: '150px' }]} className='mt-12'>
            150px
          </Box>
          <Box sx={[BoxStyles, { height: '150px' }]} className=' mt-12'>
            150px
          </Box>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Box sx={[BoxStyles, { height: '200px' }]}>200px</Box>
          <Box sx={[BoxStyles, { height: '200px' }]} className='mt-12'>
            200px
          </Box>
          <Box sx={[BoxStyles, { height: '200px' }]} className=' mt-12'>
            200px
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KubernetesResourcesTab;
