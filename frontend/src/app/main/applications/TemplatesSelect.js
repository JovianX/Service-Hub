import { Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
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
      setTemplateFormData({
        id: templateId,
        inputs_data: { [inputs[0].name]: inputs[0].default },
      });
    }
  }, [templateId]);

  const handleChangeSelect = (e) => {
    setTemplateId(e.target.value);
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

      {inputs?.map((item) => {
        if (item.type === 'string') {
          return (
            <TextField
              key={item.name}
              name='inputs'
              type='text'
              required
              id='outlined-required'
              label={item.label}
              margin='normal'
              fullWidth
              value={item.default}
            />
          );
        }
        if (item.type === 'checkbox') {
          return (
            <Box>
              <Checkbox defaultChecked />
            </Box>
          );
        }
        if (item.type === 'switch') {
          return (
            <Box>
              <Switch defaultChecked />
            </Box>
          );
        }
        if (item.type === 'select') {
          return (
            <TextField
              name='inputs'
              type='text'
              required
              id='outlined-required'
              label={item.label}
              margin='normal'
              fullWidth
              value={item.default}
            />
          );
        }
      })}
    </>
  );
};

export default TemplatesSelect;
