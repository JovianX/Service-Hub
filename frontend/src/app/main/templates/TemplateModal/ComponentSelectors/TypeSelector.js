import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';

const TypeSelector = ({ schema, value }) => {
  const [type, setType] = useState(value);

  const handleChangeType = (e) => {
    setType(e.target.value);
  };
  return (
    <FormControl size='small' required fullWidth>
      <InputLabel>Type</InputLabel>
      <Select name='type' value={type} label='Type' onChange={handleChangeType}>
        {schema.enum?.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TypeSelector;
