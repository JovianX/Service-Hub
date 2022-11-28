import { Button } from '@mui/material';
import { Box } from '@mui/system';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import yaml from 'js-yaml';
import YAML from 'json-to-pretty-yaml';
import { useEffect, useState } from 'react';

import { useSchema } from './useSchema';

const TemplateFormBuilder = ({ open, setOpen, defaultConfigYamlText, configYamlText, setDefaultConfigYamlText }) => {
  const [openInputs, setOpenInputs] = useState(false);

  const [formData, setFormData] = useState(null);

  const schema = useSchema();
  let uiSchema = {};
  const widgets = {};

  if (schema?.definitions?.chart?.enum.length) {
    uiSchema = {
      chart: {
        'ui:widget': 'ChartSelector',
      },
      type: {
        'ui:widget': 'TypeSelector',
      },
    };
  }

  useEffect(() => {
    try {
      let jsonConfig = yaml.load(configYamlText, { json: true });

      if (formData.key && formData.value) {
        jsonConfig = { ...jsonConfig, key: formData.key, value: formData.value };
      }
      if (formData.values) {
        const valuesKey = Object.keys(jsonConfig.values)[0];
        jsonConfig = { ...jsonConfig, key: valuesKey, value: jsonConfig.values[valuesKey] };
      }
      setFormData(jsonConfig);
    } catch (e) {
      console.log(e);
    }
  }, [configYamlText]);

  const handleSetDefaultConfigYamlText = (e) => {
    let { formData } = e;
    let formDataForEditor = formData;
    if (formData.key && formData.value) {
      formData = { ...formData, values: { [formData.key]: formData.value } };
      for (const key in formData) {
        formDataForEditor = { ...formDataForEditor, [key]: formData[key] };
      }

      delete formDataForEditor.key;
      delete formDataForEditor.value;
    } else {
      delete formDataForEditor.values;
    }

    setFormData(formData);
    setDefaultConfigYamlText(YAML.stringify(formDataForEditor));
  };

  useEffect(() => {
    if (open) {
      setOpenInputs(true);
      setOpen(false);
    }
  }, [open]);

  return (
    <Box className={`component ${openInputs ? 'visible_component h-full' : 'hidden_component h-0'}`}>
      {schema?.definitions?.chart?.enum.length ? (
        <Form
          schema={schema}
          // uiSchema={uiSchema}
          // widgets={widgets}
          validator={validator}
          formData={formData}
          onChange={handleSetDefaultConfigYamlText}
        >
          <Box display='flex' justifyContent='end' alignItems='center'>
            {/* <div>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div> */}
            <div>
              <Button onClick={() => setOpenInputs(false)}>Cancel</Button>
              <Button>Add a Component</Button>
            </div>
          </Box>
        </Form>
      ) : (
        ''
      )}
    </Box>
  );
};

export default TemplateFormBuilder;
