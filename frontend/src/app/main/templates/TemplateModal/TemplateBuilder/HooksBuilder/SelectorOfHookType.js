import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect } from 'react';

const TYPE_VALUES = ['kubernetes_job'];

const SelectorOfHookType = ({ type, setType, typeValue, label, infoIsYamlValid, handleOnChangeHook }) => {
  useEffect(() => {
    setType('');
    if (typeValue) {
      setType(typeValue);
    }
  }, [typeValue]);

  const handleChangeType = (e) => {
    setType(e.target.value);
    handleOnChangeHook(label, e.target.value);
  };

  return (
    <FormControl size='small' required fullWidth disabled={!!infoIsYamlValid} className='col-span-2'>
      <InputLabel>{label}</InputLabel>
      <Select name='type' value={type} label={label} onChange={handleChangeType}>
        {TYPE_VALUES?.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectorOfHookType;
