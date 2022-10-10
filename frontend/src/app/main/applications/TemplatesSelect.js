import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

const TemplatesSelect = () => {
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState({});

  const handleChangeSelect = (e) => {
    setTemplate(e.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl margin='normal' fullWidth required>
        <InputLabel id='template'>Template</InputLabel>
        <Select
          name='template_id'
          labelId='template'
          value={template}
          required
          label='Templates'
          onChange={handleChangeSelect}
        >
          {templates?.map((template) => (
            <MenuItem key={template.id} value={template.id}>
              {template.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TemplatesSelect;
