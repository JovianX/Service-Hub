import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const HelmReleaseDetailsTab = () => {
  return (
    <Box sx={{ border: 1, borderColor: 'divider' }} display='flex' className='p-12'>
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
  );
};

export default HelmReleaseDetailsTab;
