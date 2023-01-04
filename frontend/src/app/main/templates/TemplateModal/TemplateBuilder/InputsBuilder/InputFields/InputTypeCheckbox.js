import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

import TemplateBuilderInput from 'app/shared-components/TemplateBuilderInput';

const InputTypeCheckbox = ({ input, index, handleOnChangeInput, infoIsYamlValid }) => {
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
        value={input.label}
        label='Label'
        required
        disabled={!!infoIsYamlValid}
        onChangeTemplate={(e) => handleOnChangeInput(e.target.value, index, 'label')}
      />
      <FormControlLabel
        control={<Checkbox checked={input.default || false} />}
        label='Default'
        labelPlacement='end'
        disabled={!!infoIsYamlValid}
        onChange={(e) => handleOnChangeInput(e.target.checked, index, 'default')}
      />
    </>
  );
};

export default InputTypeCheckbox;
