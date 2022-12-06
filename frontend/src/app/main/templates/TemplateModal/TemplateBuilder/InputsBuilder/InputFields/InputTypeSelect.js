import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { useContext } from 'react';

import { TemplateContext } from '../../../../TemplateProvider';

const options = [
  {
    name: '',
    value: '',
    description: '',
    label: '',
  },
];

const InputTypeSelect = ({ input, index, handleOnChangeInput, handleDeleteInputOptions }) => {
  const { setTemplateBuilder } = useContext(TemplateContext);

  const handleAddOptions = (index) => {
    setTemplateBuilder((template) => {
      const { inputs } = template;
      if (inputs[index].options?.length > 0) {
        inputs[index].options = [...inputs[index].options, ...options];
      } else {
        inputs[index].options = [...options];
      }

      return { ...template, inputs };
    });
  };

  return (
    <>
      <TextField
        size='small'
        type='text'
        fullWidth
        value={input.name}
        required
        className='mr-10'
        label='Name'
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'name')}
      />
      <TextField
        size='small'
        type='text'
        fullWidth
        value={input.label}
        className='mr-10'
        label='Label'
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'label')}
      />
      <TextField
        size='small'
        type='text'
        fullWidth
        value={input.default}
        className='mr-10'
        label='Default'
        onChange={(e) => handleOnChangeInput(e.target.value, index, 'default')}
      />
      {input?.options?.length ? (
        <p className='col-span-2 mb-12'>Options</p>
      ) : (
        <Button
          className='mb-12 col-span-2 justify-start'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => handleAddOptions(index)}
        >
          New option
        </Button>
      )}

      {input?.options?.map((option, i) => (
        <div key={i}>
          <>
            <TextField
              size='small'
              type='text'
              fullWidth
              value={option.name}
              required
              className='mr-10 mb-10'
              label='Name'
              onChange={(e) => handleOnChangeInput(e.target.value, index, 'options', i, 'name')}
            />
            <TextField
              size='small'
              type='text'
              fullWidth
              value={option.value}
              required
              className='mr-10 mb-10'
              label='Value'
              onChange={(e) => handleOnChangeInput(e.target.value, index, 'options', i, 'value')}
            />
            <TextField
              size='small'
              type='text'
              fullWidth
              value={option.description}
              className='mr-10 mb-10'
              label='Description'
              onChange={(e) => handleOnChangeInput(e.target.value, index, 'options', i, 'description')}
            />
            <TextField
              size='small'
              type='text'
              fullWidth
              value={option.label}
              className='mr-10'
              label='Label'
              onChange={(e) => handleOnChangeInput(e.target.value, index, 'options', i, 'label')}
            />
          </>
          <Box display='flex' justifyContent='end'>
            <Button onClick={() => handleDeleteInputOptions(index, i)}>Delete option</Button>
          </Box>
        </div>
      ))}
      {input?.options?.length > 0 && (
        <Button
          className='mb-12 col-span-2 justify-start'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => handleAddOptions(index)}
        >
          New option
        </Button>
      )}
    </>
  );
};

export default InputTypeSelect;
