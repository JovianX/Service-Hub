import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import yaml from 'js-yaml';
import { useContext, useEffect, useRef, useState } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

const CreateAdditionalField = ({
  hookFieldsInArray,
  infoIsYamlValid,
  indexOfTypeHook,
  indexOfSelectedHook,
  hookType,
}) => {
  const addCommandButtonRef = useRef(null);
  const addArgsButtonRef = useRef(null);
  const { setTemplateBuilder } = useContext(TemplateContext);
  const [flattedFields, setFlattedFields] = useState([]);

  useEffect(() => {
    setFlattedFields(hookFieldsInArray.flat());
  }, [hookFieldsInArray]);

  useEffect(() => {
    if (hookType === 'kubernetes_job') {
      if (addCommandButtonRef.current) addCommandButtonRef.current.click();
      if (addArgsButtonRef.current) addArgsButtonRef.current.click();
    }
  }, [hookType]);

  const handleAddNewHookValue = (type, value) => {
    setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      let hooks = Object.entries(template.hooks);

      hooks[indexOfTypeHook][1][indexOfSelectedHook][type] = value;

      hooks = Object.fromEntries(hooks);
      return yaml.dump({ ...template, hooks }, { skipInvalid: true });
    });
  };

  return (
    <Box className='mt-6 col-span-2' display='flex' flexDirection='column'>
      {flattedFields.includes('enabled') ? null : (
        <Button
          disabled={!!infoIsYamlValid}
          className='mt-[-10px] col-span-2 justify-start'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => handleAddNewHookValue('enabled', 'false')}
        >
          Add enabled
        </Button>
      )}
      {flattedFields.includes('enabled') ? null : (
        <Button
          disabled={!!infoIsYamlValid}
          className='mt-[-10px] col-span-2 justify-start'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => handleAddNewHookValue('namespace', '')}
        >
          Add namespace
        </Button>
      )}
      {flattedFields.includes('on_failure') ? null : (
        <Button
          disabled={!!infoIsYamlValid}
          className='mt-[-10px] col-span-2 justify-start'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => handleAddNewHookValue('on_failure', '')}
        >
          Add on_failure
        </Button>
      )}
      {flattedFields.includes('timeout') ? null : (
        <Button
          disabled={!!infoIsYamlValid}
          className='mt-[-10px] col-span-2 justify-start'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => handleAddNewHookValue('timeout', 0)}
        >
          Add timeout
        </Button>
      )}
      {flattedFields.includes('command') ? null : (
        <Button
          ref={addCommandButtonRef}
          disabled={!!infoIsYamlValid}
          className='mt-[-10px] col-span-2 justify-start'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => handleAddNewHookValue('command', [])}
        >
          Add command
        </Button>
      )}
      {flattedFields.includes('args') ? null : (
        <Button
          ref={addArgsButtonRef}
          disabled={!!infoIsYamlValid}
          className='mt-[-10px] col-span-2 justify-start'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => handleAddNewHookValue('args', [])}
        >
          Add args
        </Button>
      )}
      {flattedFields.includes('env') ? null : (
        <Button
          disabled={!!infoIsYamlValid}
          className='mt-[-10px] col-span-2 justify-start'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => handleAddNewHookValue('env', [])}
        >
          Add env
        </Button>
      )}
    </Box>
  );
};

export default CreateAdditionalField;
