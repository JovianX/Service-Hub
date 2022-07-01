import Box from '@mui/material/Box';
import { memo } from 'react';

function FuseSplashScreen() {
  return (
    <div id='fuse-splash-screen'>
      <div className='logo'>
        <img width='200' src='assets/images/logo.png' alt='logo' />
      </div>
      <Box
        id='spinner'
        sx={{
          '& > div': {
            backgroundColor: 'palette.secondary.light',
          },
        }}
      >
        <div className='bounce1' />
        <div className='bounce2' />
        <div className='bounce3' />
      </Box>
    </div>
  );
}

export default memo(FuseSplashScreen);
