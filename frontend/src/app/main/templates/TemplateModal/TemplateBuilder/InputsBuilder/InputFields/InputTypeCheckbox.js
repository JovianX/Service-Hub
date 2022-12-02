import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

const InputTypeCheckbox = ({ input, index, handleOnChangeInput }) => {
  return (
    <>
      <TextField
        size='small'
        type='text'
        fullWidth
        defaultValue={input.name}
        required
        className='mr-10'
        label='Name'
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'name')}
      />
      <TextField
        size='small'
        type='text'
        fullWidth
        defaultValue={input.label}
        className='mr-10'
        label='Label'
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'label')}
      />
      <FormControlLabel
        control={<Checkbox checked={input.default} />}
        label='Default'
        labelPlacement='end'
        onChange={(e) => handleOnChangeInput(e.target.checked, index, 'default')}
      />
    </>
  );
};

export default InputTypeCheckbox;
