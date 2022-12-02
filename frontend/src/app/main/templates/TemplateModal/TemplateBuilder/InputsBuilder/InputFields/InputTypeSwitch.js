import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

const InputTypeSwitch = ({ input, index, handleOnChangeInput }) => {
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
        control={<Switch checked={input.default} />}
        label='Default'
        labelPlacement='end'
        onChange={(e) => handleOnChangeInput(e.target.checked, index, 'default')}
      />
    </>
  );
};

export default InputTypeSwitch;
