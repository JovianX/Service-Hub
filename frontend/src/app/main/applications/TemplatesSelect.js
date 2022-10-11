import { Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectTemplates } from 'app/store/templatesSlice';

const TemplatesSelect = ({ setTemplateFormData }) => {
  const inputText = useRef();
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

  const onChangeInputs = (item) => {
    let newItem = {};
    if (item.type === 'checkbox') {
      newItem = { ...item, default: !item.default };
    }
    if (item.type === 'string') {
      newItem = { ...item, default: inputText.current.value };
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
        if (item.type === 'string') {
          return (
            <TextField
              inputRef={inputText}
              key={item.name}
              name='text'
              type='text'
              required
              id='outlined-required'
              label={item.label}
              margin='normal'
              fullWidth
              value={item.default}
              onChange={() => onChangeInputs(item)}
            />
          );
        }
        if (item.type === 'checkbox') {
          return (
            <Box key={item.name}>
              <FormControlLabel
                name='checkbox'
                control={<Checkbox checked={item.default} />}
                label={item.label}
                labelPlacement='end'
                onChange={() => onChangeInputs(item)}
              />
            </Box>
          );
        }
        if (item.type === 'switch') {
          return (
            <Box key={item.name}>
              <Switch defaultChecked />
            </Box>
          );
        }
        if (item.type === 'select') {
          return <TextField />;
        }
      })}
    </>
  );
};

export default TemplatesSelect;
