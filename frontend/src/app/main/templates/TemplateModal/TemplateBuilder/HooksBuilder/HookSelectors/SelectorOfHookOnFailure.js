import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

const ON_FAILURE_VALUES = ['stop', 'continue'];

const SelectorOfHookOnFailure = ({ typeValue, label, infoIsYamlValid, handleOnChangeHook }) => {
  const [onFailureValue, setOnFailureValue] = useState('');

  useEffect(() => {
    setOnFailureValue('');
    if (typeValue) {
      setOnFailureValue(typeValue);
    }
  }, [typeValue]);

  const handleChangeType = (e) => {
    setOnFailureValue(e.target.value);
    handleOnChangeHook(label, e.target.value);
  };

  return (
    <FormControl size='small' required fullWidth disabled={!!infoIsYamlValid} className='col-span-2'>
      <InputLabel>{label}</InputLabel>
      <Select name='type' value={onFailureValue || typeValue} label={label} onChange={handleChangeType}>
        {ON_FAILURE_VALUES?.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectorOfHookOnFailure;
