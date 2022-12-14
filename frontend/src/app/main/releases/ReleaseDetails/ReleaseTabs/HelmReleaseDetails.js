import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ComputedValue from './TabValues/ComputedValue';
import HelmHooksValue from './TabValues/HelmHooksValue';
import ManifestsValue from './TabValues/ManifestsValue';
import NotesValue from './TabValues/NotesValue';
import UserSuppliedValue from './TabValues/UserSuppliedValue';

const HelmReleaseDetails = ({ tabValues }) => {
  return (
    <Box>
      <Box className='my-12'>
        <Accordion className='pb-8'>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Notes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <NotesValue notes={tabValues?.notes} />
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box sx={{ minHeight: 500 }} display='flex' gap='12px' className='mt-12'>
        <Box sx={{ width: '50%' }}>
          <Box className='mt-12'>
            <Accordion className='pb-8' defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography> User-Supplied Values</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <UserSuppliedValue userSupplied={tabValues?.user_supplied_values} />
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box className='mt-12'>
            <Accordion className='pb-8'>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Helm Hooks</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <HelmHooksValue helmHooks={tabValues?.detailed_hooks} />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
        <Box sx={{ width: '50%' }}>
          <Box className='mt-12'>
            <Accordion className='pb-8' defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Computed Values</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ComputedValue computedValues={tabValues?.computed_values} />
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box className='mt-12'>
            <Accordion className='pb-8'>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Manifests</Typography>
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
