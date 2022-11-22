import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect } from 'react';

const TYPE_VALUES = ['helm_chart'];

const TypeSelector = ({ type, setType, typeValue }) => {
  useEffect(() => {
    if (setType) {
      setType(TYPE_VALUES[0]);
    }
  }, [setType]);

  const handleChangeType = (e) => {
    setType(e.target.value);
  };

  return (
    <FormControl size='small' fullWidth className='mb-10'>
      <InputLabel>Type</InputLabel>
      <Select name='type' value={typeValue || type} required label='Type' onChange={handleChangeType}>
        {!typeValue ? (
          TYPE_VALUES?.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))
        ) : (
          <MenuItem key={typeValue} value={typeValue}>
            {typeValue}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default TypeSelector;
