import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

const TypePassword = ({ item, onChangeInputs }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <FormControl fullWidth margin='normal'>
      <TextField
        type={showPassword ? 'text' : 'password'}
        name='password'
        required
        label={item.label}
        value={item.default}
        onChange={(e) => onChangeInputs(e, item)}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <FormHelperText>{item?.description}</FormHelperText>
    </FormControl>
  );
};

export default TypePassword;
