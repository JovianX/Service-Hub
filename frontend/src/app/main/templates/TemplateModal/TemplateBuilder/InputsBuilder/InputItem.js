import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { useCallback, useContext } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

import InputTypeCheckbox from './InputFields/InputTypeCheckbox';
import InputTypeNumber from './InputFields/InputTypeNumber';
import InputTypes from './InputFields/InputTypes';
import InputTypeSelect from './InputFields/InputTypeSelect';
import InputTypeSlider from './InputFields/InputTypeSlider';
import InputTypeSwitch from './InputFields/InputTypeSwitch';
import InputTypeText from './InputFields/InputTypeText';

const InputItem = ({ input, index, setIndex, setSelectedIndex }) => {
  const { setTemplateBuilder } = useContext(TemplateContext);

  const handleOnChangeInput = useCallback((value, index, type, nestedIndex, nestedType) => {
    setTemplateBuilder((template) => {
      const inputs = template?.inputs || [];

      if (nestedIndex !== undefined && nestedType) {
        inputs[index][type][nestedIndex][nestedType] = value;
        return { ...template, inputs };
      }

      inputs[index][type] = value;
      return { ...template, inputs };
    });
  }, []);

  const handleDeleteInput = (index) => {
    setSelectedIndex(0);
    setIndex(0);
    setTemplateBuilder((template) => {
      let { inputs } = template;
      inputs = [...inputs.filter((item, i) => i !== index)];
      return { ...template, inputs };
    });
  };

  return (
    <div>
      <div className={`grid ${input.type === '' ? 'grid-cols-1' : 'grid-cols-2'}  gap-10`}>
        {input.type === '' && (
          <InputTypes typeValue={input.type} index={index} handleOnChangeInput={handleOnChangeInput} />
        )}
        {input.type === 'text' && (
          <InputTypeText input={input} handleOnChangeInput={handleOnChangeInput} index={index} />
        )}
        {input.type === 'textarea' && (
          <InputTypeText input={input} handleOnChangeInput={handleOnChangeInput} index={index} />
        )}
        {input.type === 'number' && (
          <InputTypeNumber input={input} handleOnChangeInput={handleOnChangeInput} index={index} />
        )}
        {input.type === 'slider' && (
          <InputTypeSlider input={input} handleOnChangeInput={handleOnChangeInput} index={index} />
        )}
        {input.type === 'select' && (
          <InputTypeSelect input={input} handleOnChangeInput={handleOnChangeInput} index={index} />
        )}
        {input.type === 'radio_select' && (
          <InputTypeSelect input={input} handleOnChangeInput={handleOnChangeInput} index={index} />
        )}
        {input.type === 'checkbox' && (
          <InputTypeCheckbox input={input} handleOnChangeInput={handleOnChangeInput} index={index} />
        )}
        {input.type === 'switch' && (
          <InputTypeSwitch input={input} handleOnChangeInput={handleOnChangeInput} index={index} />
        )}
      </div>

      <Box display='flex' justifyContent='end' className='mb-12'>
        <Button onClick={() => handleDeleteInput(index)}>Delete</Button>
      </Box>
    </div>
  );
};

export default InputItem;
