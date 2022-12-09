import TextField from '@mui/material/TextField';

const InputTypeNumber = ({ input, index, handleOnChangeInput, infoIsYamlValid }) => {
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
        type='number'
        fullWidth
        value={input.min}
        className='mr-10'
        label='Min'
        disabled={!!infoIsYamlValid}
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'min')}
      />
      <TextField
        size='small'
        type='number'
        fullWidth
        value={input.max}
        className='mr-10'
        label='Max'
        disabled={!!infoIsYamlValid}
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'max')}
      />
      <TextField
        size='small'
        type='number'
        fullWidth
        value={input.default}
        className='mr-10'
        label='Default'
        InputProps={{
          inputProps: {
            min: input.min,
            max: input.max,
          },
        }}
        disabled={!!infoIsYamlValid}
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'default')}
      />
    </>
  );
};

export default InputTypeNumber;
