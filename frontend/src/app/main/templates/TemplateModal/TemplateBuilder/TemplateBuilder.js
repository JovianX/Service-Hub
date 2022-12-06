import AddIcon from '@mui/icons-material/Add';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import { useContext, useState } from 'react';

import { TemplateContext } from '../../TemplateProvider';

import ComponentsBuilder from './ComponentsBuilder/ComponentsBuilder';
import InputsBuilder from './InputsBuilder/InputsBuilder';

const newInputs = [
  {
    name: '',
    type: '',
  },
];

const newComponents = [
  {
    name: '',
    type: '',
    chart: '',
    version: '',
  },
];

const TemplateBuilder = () => {
  const [alignment, setAlignment] = useState('');

  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const { setTemplateBuilder } = useContext(TemplateContext);

  const handleAddAnotherComponent = () => {
    setTemplateBuilder((template) => {
      let { components } = template;
      components = [...components, ...newComponents];
      return { ...template, components };
    });
  };

  const handleAddAnotherInput = () => {
    setTemplateBuilder((template) => {
      let { inputs } = template;
      inputs = [...inputs, ...newInputs];
      return { ...template, inputs };
    });
  };

  return (
    <Box className='mt-12'>
      <Box className='flex' justifyContent='space-between'>
        <Box className='w-2/5 mr-12'>
          <ToggleButtonGroup color='primary' value={alignment} exclusive onChange={handleChangeAlignment}>
            <ToggleButton size='small' value='components'>
              Components
            </ToggleButton>
            <ToggleButton size='small' value='inputs' className='w-[110px]'>
              Inputs
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box className='w-3/5'>
          {alignment === 'components' ? (
            <Box>
              <Button color='primary' variant='contained' startIcon={<AddIcon />} onClick={handleAddAnotherComponent}>
                New component
              </Button>
            </Box>
          ) : (
            ''
          )}
          {alignment === 'inputs' ? (
            <Box>
              <Button color='primary' variant='contained' startIcon={<AddIcon />} onClick={handleAddAnotherInput}>
                New input
              </Button>
            </Box>
          ) : (
            ''
          )}
        </Box>
      </Box>

      <div className='mt-24'>
        {alignment === 'components' && <ComponentsBuilder />}
        {alignment === 'inputs' && <InputsBuilder />}
      </div>
    </Box>
  );
};

export default TemplateBuilder;
