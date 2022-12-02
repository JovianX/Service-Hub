import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import { useState } from 'react';

import ComponentsBuilder from './ComponentsBuilder/ComponentsBuilder';
import InputsBuilder from './InputsBuilder/InputsBuilder';

const TemplateBuilder = () => {
  const [alignment, setAlignment] = useState('components');

  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <>
      <Box display='flex' justifyContent='center'>
        <ToggleButtonGroup color='primary' value={alignment} exclusive onChange={handleChangeAlignment}>
          <ToggleButton size='small' value='components'>
            Components
          </ToggleButton>
          <ToggleButton size='small' value='inputs' className='w-[110px]'>
            Inputs
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <div className='mt-24'>
        {alignment === 'components' && <ComponentsBuilder />}
        {alignment === 'inputs' && <InputsBuilder />}
      </div>
    </>
  );
};

export default TemplateBuilder;
