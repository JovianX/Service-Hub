import yaml from 'js-yaml';
import { useCallback, useContext } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

import InputTypeCheckbox from './InputFields/InputTypeCheckbox';
import InputTypeNumber from './InputFields/InputTypeNumber';
import InputTypes from './InputFields/InputTypes';
import InputTypeSelect from './InputFields/InputTypeSelect';
import InputTypeSlider from './InputFields/InputTypeSlider';
import InputTypeSwitch from './InputFields/InputTypeSwitch';
import InputTypeText from './InputFields/InputTypeText';

const InputItem = ({ input, index, infoIsYamlValid }) => {
  const { setTemplateBuilder } = useContext(TemplateContext);

  const handleOnChangeInput = useCallback((value, index, type, nestedIndex, nestedType) => {
    setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      const inputs = template?.inputs || [];

      if (nestedIndex !== undefined && nestedType) {
        inputs[index][type][nestedIndex][nestedType] = value;
        return yaml.dump({ ...template, inputs });
      }

      inputs[index][type] = value;
      return yaml.dump({ ...template, inputs });
    });
  }, []);

  const handleDeleteInputOptions = (inputIndex, optionIndex) => {
    setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      const { inputs } = template;
      const options = inputs[inputIndex].options.filter((item, index) => index !== optionIndex);
      inputs[inputIndex].options = options;

      return yaml.dump({ ...template, inputs });
    });
  };

  return (
    <div className='template-builder bg-deep-purple-50 bg-opacity-50 p-12'>
      <div className={`grid ${input.type === '' ? 'grid-cols-1' : 'grid-cols-2'}  gap-10`}>
        {input.type === '' && (
          <InputTypes
            typeValue={input.type}
            index={index}
            handleOnChangeInput={handleOnChangeInput}
            infoIsYamlValid={infoIsYamlValid}
          />
        )}
        {input.type === 'text' && (
          <InputTypeText
            input={input}
            handleOnChangeInput={handleOnChangeInput}
            index={index}
            infoIsYamlValid={infoIsYamlValid}
          />
        )}

        {input.type === 'textarea' && (
          <InputTypeText
            input={input}
            handleOnChangeInput={handleOnChangeInput}
            index={index}
            infoIsYamlValid={infoIsYamlValid}
          />
        )}
        {input.type === 'number' && (
          <InputTypeNumber
            input={input}
            handleOnChangeInput={handleOnChangeInput}
            index={index}
            infoIsYamlValid={infoIsYamlValid}
          />
        )}
        {input.type === 'slider' && (
          <InputTypeSlider
            input={input}
            handleOnChangeInput={handleOnChangeInput}
            index={index}
            infoIsYamlValid={infoIsYamlValid}
          />
        )}
        {input.type === 'select' && (
          <InputTypeSelect
            input={input}
            handleOnChangeInput={handleOnChangeInput}
            index={index}
            handleDeleteInputOptions={handleDeleteInputOptions}
            infoIsYamlValid={infoIsYamlValid}
          />
        )}
        {input.type === 'radio_select' && (
          <InputTypeSelect
            input={input}
            handleOnChangeInput={handleOnChangeInput}
            index={index}
            handleDeleteInputOptions={handleDeleteInputOptions}
            infoIsYamlValid={infoIsYamlValid}
          />
        )}
        {input.type === 'checkbox' && (
          <InputTypeCheckbox
            input={input}
            handleOnChangeInput={handleOnChangeInput}
            index={index}
            infoIsYamlValid={infoIsYamlValid}
          />
        )}
        {input.type === 'switch' && (
          <InputTypeSwitch
            input={input}
            handleOnChangeInput={handleOnChangeInput}
            index={index}
            infoIsYamlValid={infoIsYamlValid}
          />
        )}
      </div>
    </div>
  );
};

export default InputItem;
