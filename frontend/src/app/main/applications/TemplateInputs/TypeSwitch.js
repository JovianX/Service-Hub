import { FormControl, FormHelperText } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Box } from '@mui/system';

const TypeSwitch = ({ item, onChangeInputs }) => {
  return (
    <Box>
      <FormControl margin='normal'>
        <FormControlLabel
          control={<Switch checked={item.default} />}
          label={item.label}
          onChange={(e) => onChangeInputs(e, item)}
        />
        <FormHelperText>{item?.description}</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default TypeSwitch;
