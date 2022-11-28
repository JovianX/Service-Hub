import { Button } from '@mui/material';
import { Box } from '@mui/system';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import yaml from 'js-yaml';
import YAML from 'json-to-pretty-yaml';
import { useEffect, useState } from 'react';

import ChartSelector from '../ComponentSelectors/ChartSelector';
import TypeSelector from '../ComponentSelectors/TypeSelector';

import { UseSchema } from './UseSchema';

const TemplateFormBuilder = ({ open, setOpen, defaultConfigYamlText, configYamlText, setDefaultConfigYamlText }) => {
  const [openInputs, setOpenInputs] = useState(false);

  const [formData, setFormData] = useState(null);

  const schema = UseSchema();
  let uiSchema = {};
  let widgets = {};

  if (schema?.definitions?.chart?.enum.length) {
    uiSchema = {
      chart: {
        'ui:widget': 'ChartSelector',
      },
      type: {
        'ui:widget': 'TypeSelector',
      },
    };
    widgets = {
      ChartSelector,
      TypeSelector,
    };
  }

  useEffect(() => {
    const jsonConfig = yaml.load(configYamlText, { json: true });
    setFormData(jsonConfig);
  }, [configYamlText]);

  const handleSetDefaultConfigYamlText = (e) => {
    let { formData } = e;

    if (formData.key && formData.value) {
      const { key } = formData;
      const values = { key: formData.value };
      formData = { ...formData, values };
    }
    setFormData(formData);
    setDefaultConfigYamlText(YAML.stringify(formData));
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
          <Box display='flex' justifyContent='space-between' alignItems='center'>
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
