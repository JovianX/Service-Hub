import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useRef, useEffect, useState } from 'react';

import TypeSelector from './ComponentSelectors/TypeSelector';
import VersionSelector from './ComponentSelectors/VersionSelector';
import ChartSelector from './ComponentSelectors/ChartSelector';

const TemplateBuilder = ({ open, setOpen, setComponents, setConfigYamlText }) => {
  const nameRef = useRef();
  const keyRef = useRef();
  const valueRef = useRef();
  const [type, setType] = useState('');
  const [chart, setChart] = useState('');
  const [version, setVersion] = useState('');

  const [openInputs, setOpenInputs] = useState(false);

  useEffect(() => {
    if (open) {
      setOpenInputs(true);
      setOpen(false);
    }
  }, [open]);

  const handleAddComponent = () => {
    if (!nameRef.current.value.trim() || !type || !chart) {
      return;
    }

    const configYamlText = `\ncomponents: \n - name: ${
      nameRef.current.value
    } \n   type: ${type} \n   chart: ${chart} \n   ${version ? `version: ${version}` : ''} \n   ${
      keyRef.current.value && valueRef.current.value
        ? `values: \n    - ${keyRef.current.value}: ${valueRef.current.value}`
        : ''
    }`;

    setConfigYamlText((prevConfigYamlText) => prevConfigYamlText + configYamlText);

    const nameField = {
      field_name: 'name',
      label: 'Name',
      value: nameRef.current.value,
      required: true,
    };

    const typeField = {
      field_name: 'type',
      label: 'Type',
      value: type,
      required: true,
    };

    const chartField = {
      field_name: 'chart',
      label: 'Chart',
      value: chart,
      required: true,
    };

    const versionField = version
      ? {
          field_name: 'version',
          label: 'Version',
          value: version,
          required: false,
        }
      : null;

    const newComponents = [nameField, typeField, chartField, versionField];
    setComponents((components) => [...components, newComponents]);
    setOpenInputs(false);
  };

  return (
    <>
      {openInputs && (
        <Box>
          <Box display='flex'>
            <TextField
              name='name'
              type='text'
              label='Name'
              size='small'
              fullWidth
              className='mr-10'
              required
              inputRef={nameRef}
            />
            <TypeSelector type={type} setType={setType} />
          </Box>
          <Box display='flex'>
            <ChartSelector chart={chart} setChart={setChart} />
            <VersionSelector version={version} setVersion={setVersion} />
          </Box>
          <Box display='flex'>
            <TextField inputRef={keyRef} name='key' type='text' label='Key' size='small' fullWidth className='mb-10' />
            <TextField
              inputRef={valueRef}
              name='values'
              type='text'
              label='Value'
              size='small'
              fullWidth
              className='ml-10 mb-10'
            />
          </Box>
          <Box display='flex' justifyContent='end'>
            <Button onClick={() => setOpenInputs(false)}>Cancel</Button>
            <Button onClick={handleAddComponent}>Add a Component</Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default TemplateBuilder;
