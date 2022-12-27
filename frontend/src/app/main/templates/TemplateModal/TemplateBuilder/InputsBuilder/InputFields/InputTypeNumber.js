import TextField from '@mui/material/TextField';

import TemplateBuilderInput from 'app/shared-components/TemplateBuilderInput';

const InputTypeNumber = ({ input, index, handleOnChangeInput, infoIsYamlValid }) => {
  return (
    <>
      <TemplateBuilderInput
        value={input.name}
        label='Name'
        required
        disabled={!!infoIsYamlValid}
        onChangeTemplate={(e) => handleOnChangeInput(e.target.value, index, 'name')}
      />
      <TemplateBuilderInput
        value={input.name}
        label='Label'
        disabled={!!infoIsYamlValid}
        onChangeTemplate={(e) => handleOnChangeInput(e.target.value, index, 'label')}
      />
      <TextField
        size='small'
        type='number'
        fullWidth
        value={input.min || ''}
        className='mr-10'
        label='Min'
        disabled={!!infoIsYamlValid}
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'min')}
      />
      <TextField
        size='small'
        type='number'
        fullWidth
        value={input.max || ''}
        className='mr-10'
        label='Max'
        disabled={!!infoIsYamlValid}
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'max')}
      />
      <TextField
        size='small'
        type='number'
        fullWidth
        value={input.default || ''}
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
