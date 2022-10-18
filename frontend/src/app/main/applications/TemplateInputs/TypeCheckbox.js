import { Checkbox, FormControl, FormHelperText } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

const TypeCheckbox = ({ item, onChangeInputs }) => {
  return (
    <FormControl margin='normal'>
      <FormControlLabel
        control={<Checkbox checked={item.default} />}
        label={item.label}
        labelPlacement='end'
        onChange={(e) => onChangeInputs(e, item)}
      />
      <FormHelperText>{item?.description}</FormHelperText>
    </FormControl>
  );
};

export default TypeCheckbox;
