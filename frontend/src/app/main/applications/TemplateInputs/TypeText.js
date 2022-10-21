import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

const TypeText = ({ item, onChangeInputs }) => {
  return (
    <FormControl fullWidth margin='normal'>
      <TextField
        type='text'
        name='text'
        required
        label={item.label}
        value={item.default}
        onChange={(e) => onChangeInputs(e, item)}
      />
      <FormHelperText>{item?.description}</FormHelperText>
    </FormControl>
  );
};

export default TypeText;
