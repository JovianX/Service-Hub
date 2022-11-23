import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useRef, useEffect, useState } from 'react';

import ChartSelector from './ComponentSelectors/ChartSelector';
import TypeSelector from './ComponentSelectors/TypeSelector';
import VersionSelector from './ComponentSelectors/VersionSelector';

const TemplateBuilder = ({ open, setOpen, setComponents, setDefaultConfigYamlText }) => {
  const nameRef = useRef();
  const keyRef = useRef();
  const valueRef = useRef();
  const [type, setType] = useState('');
  const [chart, setChart] = useState('');
  const [version, setVersion] = useState('');
  const [infoMessageError, setInfoMessageError] = useState('');

  const [openInputs, setOpenInputs] = useState(false);

  useEffect(() => {
    if (open) {
      setOpenInputs(true);
      setOpen(false);
    }
  }, [open]);

  const handleAddComponent = () => {
    if (!nameRef.current.value.trim()) {
      setInfoMessageError('The name field is required');
      return;
    }

    setInfoMessageError('');

    const configYamlText = `\ncomponents: \n\n - name: ${
      nameRef.current.value
    } \n   type: ${type} \n   chart: ${chart} \n   ${version ? `version: ${version}` : ''} \n   ${
      keyRef.current.value && valueRef.current.value
        ? `values: \n    - ${keyRef.current.value}: ${valueRef.current.value}`
        : ''
    }`;

    setDefaultConfigYamlText((prevConfigYamlText) => prevConfigYamlText + configYamlText);

    const nameField = {
      field_name: 'name',
      label: 'Name',
      value: nameRef.current.value,
    };

    const typeField = {
      field_name: 'type',
      label: 'Type',
      value: type,
    };

    const chartField = {
      field_name: 'chart',
      label: 'Chart',
      value: chart,
    };

    const versionField = version
      ? {
          field_name: 'version',
          label: 'Version',
          value: version,
        }
      : null;

    const keyField = keyRef.current.value
      ? {
          field_name: 'key',
          label: 'Key',
          value: keyRef.current.value,
        }
      : null;

    const valuesField = valueRef.current.value
      ? {
          field_name: 'value',
          label: 'Value',
          value: valueRef.current.value,
        }
      : null;

    const newComponents = [nameField, typeField, chartField, versionField, keyField, valuesField];
    setComponents((components) => [...components, newComponents]);
    setOpenInputs(false);
  };

  const handleChangeInputName = () => {
    if (infoMessageError) {
      setInfoMessageError('');
    }
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
              onChange={handleChangeInputName}
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
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <div>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>
            <div>
              <Button onClick={() => setOpenInputs(false)}>Cancel</Button>
              <Button onClick={handleAddComponent}>Add a Component</Button>
            </div>
          </Box>
        </Box>
      )}
    </>
  );
};

export default TemplateBuilder;
