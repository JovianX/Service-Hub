import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

const InputTypeSwitch = ({ input, index, handleOnChangeInput, infoIsYamlValid }) => {
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
        control={<Switch checked={input.default} />}
        label='Default'
        labelPlacement='end'
        onChange={(e) => handleOnChangeInput(e.target.checked, index, 'default')}
      />
    </>
  );
};

export default InputTypeSwitch;
