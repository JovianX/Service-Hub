import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

const TypeSelect = ({ item, onChangeInputs }) => {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const defaultItem = item.options.find((radio) => radio.name === item.default);
    setValue(defaultItem.value);
  }, []);

  const onChangeSelect = (e, item) => {
    setValue(e.target.value);
    onChangeInputs(e, item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <FormControl margin='normal' fullWidth required>
      <InputLabel id='select'>{item.label}</InputLabel>
      <Select
        labelId='select'
        value={value}
        required
        label={item.label}
        onChange={(e) => {
          onChangeSelect(e, item);
        }}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        {item?.options.length &&
          item?.options.map((option) => (
            <MenuItem key={option.value} value={option.value} className='flex justify-between'>
              {option.label}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default TypeSelect;
