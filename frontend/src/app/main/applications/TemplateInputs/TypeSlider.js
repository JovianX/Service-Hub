import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

const TypeSlider = ({ item, onChangeInputs }) => {
  return (
    <FormControl fullWidth margin='normal'>
      <TextField
        key={item.name}
        label={item.label}
        type='number'
        required
        value={item.default}
        onChange={(e) => onChangeInputs(e, item)}
        InputProps={{
          inputProps: {
            max: item.max,
            min: item.min,
            step: item.step,
          },
        }}
      />
      <FormHelperText>{item?.description}</FormHelperText>
    </FormControl>
  );
};

export default TypeSlider;
