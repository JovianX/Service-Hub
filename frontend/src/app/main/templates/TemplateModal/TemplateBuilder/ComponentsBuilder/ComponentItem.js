import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import React, { useCallback, useContext, useState } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

import ChartSelector from './ComponentSelectors/ChartSelector';
import TypeSelector from './ComponentSelectors/TypeSelector';
import VersionSelector from './ComponentSelectors/VersionSelector';

const ComponentItem = ({ component, index }) => {
  const [chart, setChart] = useState('');
  const [version, setVersion] = useState('');
  const { setTemplateBuilder } = useContext(TemplateContext);

  const handleOnChangeComponent = useCallback((value, index, type) => {
    setTemplateBuilder((template) => {
      const components = template?.components || [];
      const component = components[index] || {};
      component[type] = value;
      components[index] = component;

      return { ...template, components };
    });
  }, []);

  const handleDeleteComponent = (index) => {
    setTemplateBuilder((template) => {
      let { components } = template;
      components = [...components.filter((item, i) => i !== index)];
      return { ...template, components };
    });
  };

  return (
    <div>
      <div className='grid grid-cols-2 gap-10'>
        <TextField
          size='small'
          type='text'
          fullWidth
          value={component.name}
          required
          className='mr-10'
          label='Name'
          onChange={(e) => handleOnChangeComponent(e.target.value, index, 'name')}
        />
        <TypeSelector typeValue={component.type} index={index} handleOnChangeComponent={handleOnChangeComponent} />
        <ChartSelector
          chart={chart}
          setChart={setChart}
          chartValue={component.chart}
          index={index}
          handleOnChangeComponent={handleOnChangeComponent}
        />
        <VersionSelector
          version={version}
          setVersion={setVersion}
          versionValue={component.version}
          index={index}
          handleOnChangeComponent={handleOnChangeComponent}
        />
        {component.values?.map((item, i) => (
          <React.Fragment key={i}>
            <div>
              <TextField
                size='small'
                type='text'
                fullWidth
                disabled
                defaultValue={Object.keys(item)[0]}
                className='mr-10'
                label='Key'
                // onChange={(e) => handleOnChangeComponent(e.target.value, index, 'values', 'key', i)}
              />
            </div>

            <div>
              <TextField
                size='small'
                type='text'
                fullWidth
                disabled
                defaultValue={item[Object.keys(item)]}
                className='mr-10'
                label='Value'
                // onChange={(e) => handleOnChangeComponent(e.target.value, index, 'values', 'value', i)}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
      <Box display='flex' justifyContent='end' className='mb-12'>
        <Button onClick={() => handleDeleteComponent(index)}>Delete</Button>
      </Box>
    </div>
  );
};

export default ComponentItem;
