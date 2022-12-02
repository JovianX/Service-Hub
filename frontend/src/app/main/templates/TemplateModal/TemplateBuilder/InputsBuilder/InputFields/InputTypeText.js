import TextField from '@mui/material/TextField';

const InputTypeText = ({ input, index, handleOnChangeInput }) => {
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
        type='text'
        fullWidth
        defaultValue={input.default}
        className='mr-10'
        label='Default'
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'default')}
      />
      <TextField
        size='small'
        type='text'
        fullWidth
        defaultValue={input.description}
        className='mr-10'
        label='Description'
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'description')}
      />
    </>
  );
};

export default InputTypeText;
