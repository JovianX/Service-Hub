import TextField from '@mui/material/TextField';

const TemplateBuilderInput = ({ value, disabled, onChangeTemplate, label, required }) => {
  return (
    <TextField
      size='small'
      type='text'
      fullWidth
      value={value || ''}
      required={required}
      className='mr-10'
      label={label}
      disabled={disabled}
      onChange={onChangeTemplate}
    />
  );
};

export default TemplateBuilderInput;
