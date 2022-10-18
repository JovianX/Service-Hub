import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectTemplates } from 'app/store/templatesSlice';

import TypeCheckbox from './TypeCheckbox';
import TypeNumber from './TypeNumber';
import TypeRadio from './TypeRadio';
import TypeSelect from './TypeSelect';
import TypeSlider from './TypeSlider';
import TypeSwitch from './TypeSwitch';
import TypeText from './TypeText';
import TypeTextarea from './TypeTextarea';

const TemplateInputs = ({ setTemplateFormData, clearMessages }) => {
  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState('');
  const [inputs, setInputs] = useState([]);
  const templatesData = useSelector(selectTemplates);

  useEffect(() => {
    templatesData.forEach((item) => {
      if (item.default) {
        setTemplateId(item.id);
      }
    });
    setTemplates(templatesData);
  }, [templatesData]);

  useEffect(() => {
    const template = templates.find((item) => item.id === templateId);
    if (template) {
      const { inputs } = template.parsed_template;
      setInputs(inputs);
    }
  }, [templateId]);

  useEffect(() => {
    if (inputs.length) {
      const obj = {};
      inputs.map((item) => (obj[item.name] = item.default));
      setTemplateFormData(obj);
    }
  }, [inputs]);

  const handleChangeSelect = (e) => {
    setTemplateId(e.target.value);
  };

  const onChangeInputs = (e, item) => {
    clearMessages();
    let newItem = {};

    switch (item.type) {
      case 'text':
        newItem = { ...item, default: e.target.value };
        break;
      case 'textarea':
        newItem = { ...item, default: e.target.value };
        break;
      case 'select':
        newItem = { ...item, default: e.target.value };
        break;
      case 'radio_select':
        newItem = { ...item, default: e.target.value };
        break;
      case 'switch':
        newItem = { ...item, default: !item.default };
        break;
      case 'checkbox':
        newItem = { ...item, default: !item.default };
        break;
      case 'slider':
        newItem = { ...item, default: e.target.value };
        break;
      case 'number':
        newItem = { ...item, default: e.target.value };
        break;
      default:
    }

    setInputs((input) => {
      return [
        ...inputs.slice(0, inputs.indexOf(item)),
        newItem,
        ...inputs.slice(inputs.indexOf(item) + 1, inputs.length),
      ];
    });
  };

  return (
    <>
      <Box sx={{ minWidth: 120 }}>
        <FormControl margin='normal' fullWidth required>
          <InputLabel id='template'>Template</InputLabel>
          <Select
            name='template_id'
            labelId='template'
            value={templateId}
            required
            label='Templates'
            onChange={handleChangeSelect}
          >
            {templates?.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {`${template.name} ${template.revision}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {inputs?.map((item, index) => {
        switch (item.type) {
          case 'text':
            return <TypeText key={item.name} item={item} onChangeInputs={onChangeInputs} />;
          case 'textarea':
            return <TypeTextarea key={item.name} item={item} onChangeInputs={onChangeInputs} />;
          case 'select':
            return <TypeSelect key={item.name} item={item} onChangeInputs={onChangeInputs} />;
          case 'radio_select':
            return <TypeRadio key={item.name} item={item} onChangeInputs={onChangeInputs} />;
          case 'switch':
            return <TypeSwitch key={item.name} item={item} onChangeInputs={onChangeInputs} />;
          case 'checkbox':
            return <TypeCheckbox key={item.name} item={item} onChangeInputs={onChangeInputs} />;
          case 'slider':
            return <TypeSlider key={item.name} item={item} onChangeInputs={onChangeInputs} />;
          case 'number':
            return <TypeNumber key={item.name} item={item} onChangeInputs={onChangeInputs} />;
          default:
        }
      })}
    </>
  );
};

export default TemplateInputs;
