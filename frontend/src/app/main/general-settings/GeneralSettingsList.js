import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { setSetting } from '../../api/general-settings';

const GeneralSettingsList = () => {
  const [loading, setLoading] = useState(false);
  const handleSetApplicationTTL = async (e) => {
    e.preventDefault();

    await setSetting('application_ttl', {
      minutes: e.target.form.ttl.value,
    });
  };

  return (
    <Box className='h-full m-24 rounded'>
      <Box className='my-12 w-1/2'>
        <form onSubmit={handleSetApplicationTTL}>
          <Box>
            <Typography variant='subtitle1'>Application TTL</Typography>
            <Box marginTop={1}>
              <TextField label='Application TTL' name='ttl' size='small' required />
            </Box>
          </Box>
          <LoadingButton
            type='submit'
            className='mt-16'
            color='primary'
            onClick={handleSetApplicationTTL}
            loading={loading}
            loadingPosition='start'
            startIcon={<SaveIcon />}
            variant='contained'
          >
            Save
          </LoadingButton>
        </form>
      </Box>
    </Box>
  );
};

export default GeneralSettingsList;
