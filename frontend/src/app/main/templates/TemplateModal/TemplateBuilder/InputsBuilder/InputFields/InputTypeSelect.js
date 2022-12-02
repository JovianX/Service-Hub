import TextField from '@mui/material/TextField';
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

const InputTypeSelect = ({ input, index, handleOnChangeInput }) => {
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
      {input?.options?.length ? (
        <p className='col-span-2 mb-12'>Options</p>
      ) : (
        <p className='col-span-2 mb-12 hover:cursor-pointer' onClick={() => handleAddOptions(index)}>
          Add Options
        </p>
      )}

      {input?.options?.map((option, i) => (
        <div key={i}>
          <TextField
            size='small'
            type='text'
            fullWidth
            defaultValue={option.name}
            required
            className='mr-10 mb-10'
            label='Name'
            onChange={(e) => handleOnChangeInput(e.target.value, index, 'options', i, 'name')}
          />
          <TextField
            size='small'
            type='text'
            fullWidth
            defaultValue={option.value}
            required
            className='mr-10 mb-10'
            label='Value'
            onChange={(e) => handleOnChangeInput(e.target.value, index, 'options', i, 'value')}
          />
          <TextField
            size='small'
            type='text'
            fullWidth
            defaultValue={option.description}
            className='mr-10 mb-10'
            label='Description'
            onChange={(e) => handleOnChangeInput(e.target.value, index, 'options', i, 'description')}
          />
          <TextField
            size='small'
            type='text'
            fullWidth
            defaultValue={option.label}
            className='mr-10'
            label='Label'
            onChange={(e) => handleOnChangeInput(e.target.value, index, 'options', i, 'label')}
          />
        </div>
      ))}
      {input?.options?.length > 0 && (
        <p className='col-span-2 mb-12 hover:cursor-pointer' onClick={() => handleAddOptions(index)}>
          Add another option
        </p>
      )}
    </>
  );
};

export default InputTypeSelect;
