import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
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
        <Box sx={{ width: '50%' }}>
          <Box sx={[BoxStyles, { height: '220px' }]}>
            <Typography variant='subtitle1'> User-Supplied Values:</Typography>
            <UserSuppliedValue userSupplied={tabValues?.user_supplied_values} />
          </Box>
          <Box sx={[BoxStyles, { height: '420px' }]} className='mt-12'>
            <Typography variant='subtitle1'>Computed Values:</Typography>
            <ComputedValue computedValues={tabValues?.computed_values} />
          </Box>
          <Box className='mt-12'>
            <Accordion className='pb-8'>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Helm Hooks:</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <HelmHooksValue helmHooks={tabValues?.detailed_hooks} />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
        <Box sx={{ width: '50%' }}>
          <Box sx={[BoxStyles, { height: '425px' }]}>
            <Typography variant='subtitle1'>Notes:</Typography>
            <NotesValue notes={tabValues?.notes} />
          </Box>
          <Box className='mt-12'>
            <Accordion className='pb-8'>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Manifests:</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ManifestsValue manifests={tabValues?.detailed_manifest} />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HelmReleaseDetails;
