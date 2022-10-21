import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

const TypeTextarea = ({ item, onChangeInputs }) => {
  return (
    <FormControl fullWidth margin='normal'>
      <TextField
        label={item.label}
        name='textarea'
        required
        multiline
        minRows={2}
        value={item.default}
        onChange={(e) => onChangeInputs(e, item)}
      />
      <FormHelperText>{item?.description}</FormHelperText>
    </FormControl>
  );
};

export default TypeTextarea;
