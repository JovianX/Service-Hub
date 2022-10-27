import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import ReleaseTable from './ReleaseTable';
import ReleaseTabs from './ReleaseTabs/ReleaseTabs';

const ReleaseItem = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [release, setRelease] = useState({});
  const [ttl, setTtl] = useState('');
  const [health, setHealth] = useState('');

  useEffect(() => {
    if (location.state?.release.name) {
      setRelease(location.state.release);
      setTtl(location.state.ttl);
      setHealth(location.state.health);
    }
  }, [location]);

  return (
    <Box className='h-full m-24 rounded'>
      <Box display='flex' justifyContent='start' alignItems='center'>
        <Box display='flex' alignItems='center'>
          <ArrowBackIosIcon onClick={() => navigate(-1)} className='hover:cursor-pointer' />
          <Typography variant='h6'>Helm release : {release.name}</Typography>
        </Box>
      </Box>

      <ReleaseTable release={release} ttl={ttl} health={health} />
      <ReleaseTabs release={release} />
    </Box>
  );
};

export default ReleaseItem;
