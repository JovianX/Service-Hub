import { FormGroup, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useContext, useState } from 'react';

import { TemplateContext } from '../../TemplateProvider';

import ComponentsBuilder from './ComponentsBuilder/ComponentsBuilder';
import InputsBuilder from './InputsBuilder/InputsBuilder';

const TemplateBuilder = () => {
  const [alignment, setAlignment] = useState('');

  const { infoIsYamlValid, setIsInputByHand, isInputByHand } = useContext(TemplateContext);

  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleOnChangeInput = (e) => {
    setIsInputByHand(e.target.checked);
  };

  return (
    <Box className='mt-12'>
      <Box className='mr-12' display='flex' justifyContent='space-between'>
        <ToggleButtonGroup color='primary' value={alignment} exclusive onChange={handleChangeAlignment}>
          <ToggleButton size='small' value='components'>
            Components
          </ToggleButton>
          <ToggleButton size='small' value='inputs' className='w-[110px]'>
            Inputs
          </ToggleButton>
        </ToggleButtonGroup>

        <FormGroup>
          <FormControlLabel
            control={<Switch color='primary' onChange={handleOnChangeInput} checked={isInputByHand} />}
            label='add manually'
          />
        </FormGroup>
      </Box>

      <div className='mt-24 h-max'>
        {alignment === 'components' && <ComponentsBuilder />}
        {alignment === 'inputs' && <InputsBuilder />}
      </div>
      <div className={`${alignment ? 'mt-[-28px]' : ''} min-h-[30px] flex justify-center`}>
        {infoIsYamlValid && <p className='text-red'>{infoIsYamlValid}</p>}
      </div>
    </Box>
  );
};

export default TemplateBuilder;
