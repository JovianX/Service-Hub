import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

const TYPE_VALUES = ['text', 'textarea', 'select', 'radio_select', 'switch', 'checkbox', 'slider', 'number'];

const InputTypes = ({ typeValue, index, handleOnChangeInput }) => {
  const [type, setType] = useState('');

  useEffect(() => {
    if (typeValue) {
      setType(typeValue);
    }
  }, [typeValue]);

  const handleChangeType = (e) => {
    setType(e.target.value);
    handleOnChangeInput(e.target.value, index, 'type');
  };

  return (
    <>
      <FormControl size='small' margin='normal' required fullWidth className='my-0'>
        <InputLabel>Type</InputLabel>
        <Select name='type' value={type} label='Type' onChange={handleChangeType}>
          {TYPE_VALUES?.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default InputTypes;
