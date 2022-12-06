import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { useContext, useRef } from 'react';

import { TemplateContext } from '../../../../TemplateProvider';

const ValuesInputs = ({ value, index, nestedIndex, handleDeleteComponentValues }) => {
  const { setTemplateBuilder } = useContext(TemplateContext);

  const inputRefKey1 = useRef();
  const inputRefKey2 = useRef();
  const inputRefKey3 = useRef();
  const inputRefValue = useRef();

  const handleOnChangeValuesInputs = () => {
    setTemplateBuilder((template) => {
      const { components } = template;

      const newValue = {
        [inputRefKey1.current.value]: {
          [inputRefKey2.current.value]: {
            [inputRefKey3.current.value]: inputRefValue.current.value,
          },
        },
      };

      components[index].values[nestedIndex] = newValue;

      return { ...template, components };
    });
  };

  return (
    <>
      <TextField
        inputRef={inputRefKey1}
        size='small'
        type='text'
        fullWidth
        value={value[0] || ''}
        className='mr-10'
        label='Key'
        onChange={handleOnChangeValuesInputs}
      />
      <TextField
        inputRef={inputRefKey2}
        size='small'
        type='text'
        fullWidth
        value={value[1] || ''}
        className='mr-10'
        label='Key'
        onChange={handleOnChangeValuesInputs}
      />
      <TextField
        inputRef={inputRefKey3}
        size='small'
        type='text'
        fullWidth
        value={value[2] || ''}
        className='mr-10'
        label='Key'
        onChange={handleOnChangeValuesInputs}
      />
      <TextField
        inputRef={inputRefValue}
        size='small'
        type='text'
        fullWidth
        value={value[3] || ''}
        className='mr-10'
        label='Value'
        onChange={handleOnChangeValuesInputs}
      />
      <Box display='flex' justifyContent='end' className='col-span-2 mt-[-10px]'>
        <Button onClick={() => handleDeleteComponentValues(index, nestedIndex)}>Delete value</Button>
      </Box>
    </>
  );
};

export default ValuesInputs;
