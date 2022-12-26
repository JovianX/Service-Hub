import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import ApplicationTable from './ApplicationTable';
import ApplicationTabs from './ApplicationTabs/ApplicationTabs';

const ApplicationItem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [application, setApplication] = useState({});

  useEffect(() => {
    if (location.state?.row) {
      setApplication(location.state.row);
    }
  }, [location]);

  if (!location?.state?.row) {
    return <Navigate to='/404' />;
  }

  return (
    <Box className='h-full m-24 rounded'>
      <Box display='flex' justifyContent='start' alignItems='center'>
        <Box display='flex' alignItems='center'>
          <ArrowBackIosIcon onClick={() => navigate(-1)} className='hover:cursor-pointer' />
          <Typography variant='h6'>Application : {application.name}</Typography>
        </Box>
      </Box>

      <ApplicationTable application={application} />
      <ApplicationTabs />
    </Box>
  );
};

export default ApplicationItem;
