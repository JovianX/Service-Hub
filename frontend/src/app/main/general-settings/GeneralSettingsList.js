import { TextField } from '@mui/material';
import Box from '@mui/material/Box';

import FuseLoading from '@fuse/core/FuseLoading';
import { useGetGeneralSettingsQuery } from 'app/store/generalSettingSlice';

import { setSetting } from '../../api/general-settings';

const GeneralSettingsList = () => {
  const { data: generalSettings, isLoading } = useGetGeneralSettingsQuery();

  const handleSetApplicationTTL = async (e) => {
    e.preventDefault();

    await setSetting('application_ttl', {
      minutes: e.target.form.ttl.value,
    });
  };

  if (isLoading) {
    return (
      <div className='w-full flex flex-col min-h-full'>
        <FuseLoading />
      </div>
    );
  }

  return (
    <Box className='h-full m-24 rounded'>
      <Box className='my-12 w-1/2'>
        <form onSubmit={handleSetApplicationTTL}>
          {generalSettings.length > 0 &&
            generalSettings?.map((setting) => (
              <Box className='mb-10' key={setting[0]}>
                <TextField placeholder={setting[0]} value={setting[1]} label={setting[0]} />
              </Box>
            ))}
        </form>
      </Box>
    </Box>
  );
};

export default GeneralSettingsList;
