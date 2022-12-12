import TextField from '@mui/material/TextField';

const InputTypeText = ({ input, index, handleOnChangeInput, infoIsYamlValid }) => {
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
      <TextField
        size='small'
        type='text'
        fullWidth
        value={input.default || ''}
        className='mr-10'
        label='Default'
        disabled={!!infoIsYamlValid}
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'default')}
      />
      <TextField
        size='small'
        type='text'
        fullWidth
        value={input.description || ''}
        className='mr-10'
        label='Description'
        disabled={!!infoIsYamlValid}
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'description')}
      />
    </>
  );
};

export default InputTypeText;
