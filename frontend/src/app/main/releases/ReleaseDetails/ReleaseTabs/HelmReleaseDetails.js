import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { getTubValues } from '../../../../api';

import ManifestsValue from './TabValues/ManifestsValue';
import NotesValue from './TabValues/NotesValue';
import UserSuppliedValue from './TabValues/UserSuppliedValue';

const BoxStyles = {
  border: 1,
  borderColor: 'divider',
  padding: 2,
};

const APIsList = ['user-supplied-values', 'computed-values', 'detailed-hooks', 'notes', 'detailed-manifest'];

const HelmReleaseDetails = ({ release }) => {
  const [tabValues, setTabValues] = useState({});

  useEffect(() => {
    tabValuesRequest();
  }, [release]);

  function tabValuesRequest() {
    if (release?.name) {
      APIsList.map((row) => {
        getTubValues(release.context_name, release.namespace, release.name, row).then((res) => {
          const tabValues = {};
          tabValues[row.replace('-', '_')] = res.data;
          setTabValues((value) => ({ ...value, ...tabValues }));
        });
      });
    }
  }

  return (
    <Box>
      <Box sx={{ minHeight: 500 }} display='flex' gap='12px' className='mt-12'>
        <Box sx={{ width: '100%' }}>
          <Box sx={[BoxStyles, { height: '100px' }]}>
            <Typography variant='subtitle1'> User-Supplied Values:</Typography>
            <UserSuppliedValue userSupplied={tabValues?.user_supplied_values} />
          </Box>
          <Box sx={[BoxStyles, { height: '350px' }]} className='mt-12'>
            200px
          </Box>
          <Box sx={[BoxStyles, { height: '400px' }]} className=' mt-12'>
            300px
          </Box>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Box sx={[BoxStyles, { height: '350px' }]}>
            <Typography variant='subtitle1'>Notes:</Typography>
            <NotesValue notes={tabValues?.notes} />
          </Box>
          <Box sx={[BoxStyles, { height: '512px' }]} className='mt-12'>
            <Typography variant='subtitle1'>Manifests:</Typography>
            <ManifestsValue manifests={tabValues?.detailed_manifest} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HelmReleaseDetails;
