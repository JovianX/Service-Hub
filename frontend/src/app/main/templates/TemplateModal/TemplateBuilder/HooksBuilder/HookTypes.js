import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

const TYPE_VALUES = ['pre_install', 'post_install', 'pre_upgrade', 'post_upgrade', 'pre_terminate', 'post_terminate'];

const HookTypes = ({ typeValue, index, handleOnChangeHook, infoIsYamlValid }) => {
  const [type, setType] = useState('');

  useEffect(() => {
    if (typeValue) {
      setType(typeValue);
    }
  }, [typeValue]);

  const handleChangeType = (e) => {
    setType(e.target.value);
    handleOnChangeHook(e.target.value, index, 'type');
  };

  return (
    <>
      <FormControl
        size='small'
        margin='normal'
        required
        fullWidth
        className='my-0 col-span-2'
        disabled={!!infoIsYamlValid}
      >
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

export default HookTypes;
