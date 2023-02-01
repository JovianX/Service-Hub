import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';

import { getApplicationsList } from 'app/store/applicationsSlice';

import { getApplicationOutputs as getApplicationOutputsAPI } from '../../../api';

import ApplicationTable from './ApplicationTable';
import ApplicationTabs from './ApplicationTabs/ApplicationTabs';

const ApplicationItem = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [application, setApplication] = useState({});
  const [outputs, setOutputs] = useState(location.state.outputs);

  useEffect(() => {
    if (location.state?.row) {
      setApplication(location.state.row);
    }
  }, [location]);

  useEffect(() => {
    if (!location.state.outputs) {
      (async () => {
        await getApplicationOutputsAPI(application.id).then(({ data }) => setOutputs(data.notes));
      })();
    }
  }, [location.state.outputs, application]);

  useEffect(() => {
    const getApplicationsTimer = setInterval(async () => {
      await dispatch(getApplicationsList()).then(({ payload }) => {
        const application = payload.find((application) => application.id === +id);
        setApplication(application);
      });
    }, 6000);

    return () => clearInterval(getApplicationsTimer);
  }, []);

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
      <ApplicationTabs outputs={outputs} inputs={application.user_inputs} />
    </Box>
  );
};

export default ApplicationItem;
