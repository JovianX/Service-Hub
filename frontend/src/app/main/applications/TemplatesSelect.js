import { Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectTemplates } from 'app/store/templatesSlice';

const TemplatesSelect = ({ setTemplateFormData }) => {
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
    let newItem = {};
    if (item.type === 'text') {
      newItem = { ...item, default: e.target.value };
    }
    if (item.type === 'textarea') {
      newItem = { ...item, default: e.target.value };
    }
    if (item.type === 'select') {
      newItem = { ...item, default: e.target.value };
    }
    if (item.type === 'radio_select') {
      newItem = { ...item, default: e.target.value };
    }
    if (item.type === 'switch') {
      newItem = { ...item, default: !item.default };
    }
    if (item.type === 'checkbox') {
      newItem = { ...item, default: !item.default };
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
        if (item.type === 'text') {
          return (
            <TextField
              key={item.name}
              margin='normal'
              type='text'
              required
              label={item.label}
              fullWidth
              value={item.default}
              onChange={(e) => onChangeInputs(e, item)}
            />
          );
        }
        if (item.type === 'textarea') {
          return (
            <TextField
              key={item.name}
              label={item.label}
              margin='normal'
              required
              multiline
              rows={2}
              value={item.default}
              fullWidth
              onChange={(e) => onChangeInputs(e, item)}
            />
          );
        }
        if (item.type === 'select') {
          return (
            <Box key={item.name}>
              <FormControl margin='normal' fullWidth required>
                <InputLabel id='select'>{item.label}</InputLabel>
                <Select
                  labelId='select'
                  value={item.default ?? ''}
                  required
                  label={item.label}
                  onChange={(e) => onChangeInputs(e, item)}
                >
                  {item?.options.length &&
                    item?.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          );
        }

        if (item.type === 'radio_select') {
          return (
            <Box key={item.name}>
              <FormControl margin='normal'>
                <FormLabel id='demo-row-radio-buttons-group-label'>{item.label}</FormLabel>
                <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='row-radio-buttons-group'>
                  {item?.options.length &&
                    item?.options.map((radio) => (
                      <FormControlLabel
                        key={radio.value}
                        value={radio.value}
                        control={<Radio />}
                        label={radio.label}
                        onChange={(e) => onChangeInputs(e, item)}
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            </Box>
          );
        }

        if (item.type === 'switch') {
          return (
            <Box key={item.name}>
              <FormControl margin='normal'>
                <FormControlLabel
                  control={<Switch checked={item.default} />}
                  label={item.label}
                  onChange={(e) => onChangeInputs(e, item)}
                />
              </FormControl>
            </Box>
          );
        }
        if (item.type === 'checkbox') {
          return (
            <Box key={item.name}>
              <FormControl margin='normal'>
                <FormControlLabel
                  control={<Checkbox checked={item.default} />}
                  label={item.label}
                  labelPlacement='end'
                  onChange={(e) => onChangeInputs(e, item)}
                />
              </FormControl>
            </Box>
          );
        }
      })}
    </>
  );
};

export default TemplatesSelect;
