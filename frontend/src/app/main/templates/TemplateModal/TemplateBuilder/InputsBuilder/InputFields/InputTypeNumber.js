import TextField from '@mui/material/TextField';

const InputTypeNumber = ({ input, index, handleOnChangeInput }) => {
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
      <TextField
        size='small'
        type='number'
        fullWidth
        defaultValue={input.min}
        className='mr-10'
        label='Min'
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'min')}
      />
      <TextField
        size='small'
        type='number'
        fullWidth
        defaultValue={input.max}
        className='mr-10'
        label='Max'
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'max')}
      />
      <TextField
        size='small'
        type='number'
        fullWidth
        defaultValue={input.default}
        className='mr-10'
        label='Default'
        InputProps={{
          inputProps: {
            min: input.min,
            max: input.max,
          },
        }}
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'default')}
      />
    </>
  );
};

export default InputTypeNumber;
