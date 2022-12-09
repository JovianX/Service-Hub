import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

const TYPE_VALUES = ['helm_chart'];

const TypeSelector = ({ typeValue, handleOnChangeComponent, index, infoIsYamlValid }) => {
  const [type, setType] = useState('');

  useEffect(() => {
    setType('');
    if (typeValue) {
      setType(typeValue);
    }
  }, [typeValue]);

  const handleChangeType = (e) => {
    setType(e.target.value);
    handleOnChangeComponent(e.target.value, index, 'type');
  };

  return (
    <FormControl size='small' required fullWidth disabled={!!infoIsYamlValid}>
      <InputLabel>Type</InputLabel>
      <Select name='type' value={type} label='Type' onChange={handleChangeType}>
        {TYPE_VALUES?.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TypeSelector;
