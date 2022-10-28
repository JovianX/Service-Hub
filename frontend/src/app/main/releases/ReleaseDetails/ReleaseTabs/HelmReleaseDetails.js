import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { getTubValues } from '../../../../api';

import ComputedValue from './TabValues/ComputedValue';
import HelmHooksValue from './TabValues/HelmHooksValue';
import ManifestsValue from './TabValues/ManifestsValue';
import NotesValue from './TabValues/NotesValue';
import UserSuppliedValue from './TabValues/UserSuppliedValue';

const BoxStyles = {
  border: 1,
  borderColor: 'divider',
  padding: 2,
  paddingBottom: 4,
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
          tabValues[row.replace(/-/gi, '_')] = res.data;
          setTabValues((value) => ({ ...value, ...tabValues }));
        });
      });
    }
  }

  return (
    <Box>
      <Box sx={{ minHeight: 500 }} display='flex' gap='12px' className='mt-12'>
        <Box sx={{ width: '100%' }}>
          <Box sx={[BoxStyles, { height: '220px' }]}>
            <Typography variant='subtitle1'> User-Supplied Values:</Typography>
            <UserSuppliedValue userSupplied={tabValues?.user_supplied_values} />
          </Box>
          <Box sx={[BoxStyles, { height: '420px' }]} className='mt-12'>
            <Typography variant='subtitle1'>Computed Values:</Typography>
            <ComputedValue computedValues={tabValues?.computed_values} />
          </Box>
          <Box sx={[BoxStyles, { height: '470px' }]} className='mt-12'>
            <Typography variant='subtitle1'>Helm Hooks:</Typography>
            <HelmHooksValue helmHooks={tabValues?.detailed_hooks} />
          </Box>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Box sx={[BoxStyles, { height: '425px' }]}>
            <Typography variant='subtitle1'>Notes:</Typography>
            <NotesValue notes={tabValues?.notes} />
          </Box>
          <Box sx={[BoxStyles, { height: '697px' }]} className='mt-12'>
            <Typography variant='subtitle1'>Manifests:</Typography>
            <ManifestsValue manifests={tabValues?.detailed_manifest} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HelmReleaseDetails;
