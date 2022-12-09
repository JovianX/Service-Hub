import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

const InputTypeCheckbox = ({ input, index, handleOnChangeInput, infoIsYamlValid }) => {
  return (
    <>
      <TextField
        size='small'
        type='text'
        fullWidth
        value={input.name || ''}
        required
        className='mr-10'
        label='Name'
        disabled={!!infoIsYamlValid}
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'name')}
      />
      <TextField
        size='small'
        type='text'
        fullWidth
        value={input.label || ''}
        className='mr-10'
        label='Label'
        disabled={!!infoIsYamlValid}
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'label')}
      />
      <FormControlLabel
        disabled={!!infoIsYamlValid}
        control={<Checkbox checked={input.default} />}
        label='Default'
        labelPlacement='end'
        onChange={(e) => handleOnChangeInput(e.target.checked, index, 'default')}
      />
    </>
  );
};

export default InputTypeCheckbox;
