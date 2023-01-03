import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

const ENABLED_VALUES = ['true', 'false'];

const SelectorOfHookEnabled = ({ typeValue, label, infoIsYamlValid, handleOnChangeHook }) => {
  const [enabled, setEnabled] = useState('');

  useEffect(() => {
    setEnabled('');
    if (typeValue) {
      setEnabled(typeValue);
    }
  }, [typeValue]);

  const handleChangeType = (e) => {
    setEnabled(e.target.value);
    handleOnChangeHook(label, e.target.value);
  };

  return (
    <FormControl size='small' required fullWidth disabled={!!infoIsYamlValid} className='col-span-2'>
      <InputLabel>{label}</InputLabel>
      <Select name='type' value={enabled || typeValue} label={label} onChange={handleChangeType}>
        {ENABLED_VALUES?.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectorOfHookEnabled;
