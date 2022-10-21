import { FormControl } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useEffect, useState } from 'react';

const TypeRadio = ({ item, onChangeInputs }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const defaultItem = item.options.find((radio) => radio.name === item.default);
    setValue(defaultItem.value);
  }, []);

  const onChangeRadio = (e, item) => {
    setValue(e.target.value);
    onChangeInputs(e, item);
  };

  return (
    <FormControl margin='normal'>
      <FormLabel id='demo-row-radio-buttons-group-label'>{item.label}</FormLabel>
      <RadioGroup row value={value}>
        {item?.options.length &&
          item?.options.map((radio) => (
            <FormControlLabel
              key={radio.name}
              value={radio.value}
              control={<Radio />}
              label={radio.label}
              onChange={(e) => onChangeRadio(e, item)}
            />
          ))}
      </RadioGroup>
    </FormControl>
  );
};

export default TypeRadio;
