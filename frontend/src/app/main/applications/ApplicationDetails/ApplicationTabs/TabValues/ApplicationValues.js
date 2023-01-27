import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

const inputs = { name: 'aaa', lastname: 'bbb', age: 30 };

const ApplicationValues = ({ output }) => {
  const [yamlInputsJSX, setYamlInputsJSX] = useState([]);

  useEffect(() => {
    const yamlInputs = [];

    for (const key in inputs) {
      yamlInputs.push(
        <p>
          {key}: {inputs[key]}
        </p>,
      );
    }
    setYamlInputsJSX(yamlInputs);
  }, [inputs]);

  return (
    <Box display='flex' className='mt-12'>
      <Box className='mt-12 w-1/2'>
        <Accordion className='shadow-none p-0' defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography gutterBottom variant='h6' component='div'>
              Inputs
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Card className='h-[200px] p-0' sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant='body2' color='text.secondary'>
                  {yamlInputsJSX}
                </Typography>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Box className='mt-12 w-1/2'>
        <Accordion className='pb-8 shadow-none p-0' defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography gutterBottom variant='h6' component='div'>
              Output
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Card className='h-[200px] p-0' sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant='body2' color='text.secondary'>
                  {output}
                </Typography>
              </CardContent>
            </Card>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default ApplicationValues;
