import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import ReleaseTable from './ReleaseTable';
import ReleaseTabs from './ReleaseTabs/ReleaseTabs';

const ReleaseItem = () => {
  const { id } = useParams();
  const location = useLocation();
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
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Box display='flex' alignItems='center'>
          <Typography variant='subtitle2'>Helm release : {release.name}</Typography>
          <ButtonGroup aria-label='primary button group'>
            <Button variant='text'>Namespace</Button>
            <Button variant='text'>Cluster</Button>
          </ButtonGroup>
        </Box>

        <Box display='flex'>
          <ButtonGroup aria-label='primary button group'>
            <Button variant='text'>Uninstall</Button>
            <Button variant='text'>Rollback</Button>
            <Button variant='text'>🔺 Upgrade Available</Button>
          </ButtonGroup>
        </Box>
      </Box>

      <ReleaseTable release={release} ttl={ttl} health={health} />
      <ReleaseTabs release={release} />
    </Box>
  );
};

export default ReleaseItem;
