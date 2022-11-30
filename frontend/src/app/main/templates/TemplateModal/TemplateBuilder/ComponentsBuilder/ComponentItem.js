import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import React, { useCallback, useState } from 'react';

import ChartSelector from './ComponentSelectors/ChartSelector';
import TypeSelector from './ComponentSelectors/TypeSelector';
import VersionSelector from './ComponentSelectors/VersionSelector';

const ComponentItem = ({ index, component, setTemplateBuilder }) => {
  const [chart, setChart] = useState('');
  const [version, setVersion] = useState('');
  const [showItem, setShowItem] = useState(true);

  const handleOnChangeComponent = useCallback((value, index, type) => {
    setTemplateBuilder((template) => {
      const { components } = template;
      const component = components[index];

      // if (type === 'values') {
      //   if (valuesType === 'key') {
      //     component[Object.keys(component[type][valuesIndex])[0]]= value;
      //   }
      // }
      component[type] = value;
      components[index] = component;

      return { ...template, components };
    });
  }, []);

  const handleDeleteComponent = (name, index) => {
    setTemplateBuilder((template) => {
      let { components } = template;
      components = [...components.filter((item, i) => i !== index)];
      return { ...template, components };
    });
  };

  const handleShowItem = () => {
    setShowItem((prevShow) => !prevShow);
  };

  return (
    <div>
      {showItem ? (
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

          {/* {component.values?.map((item) => ( */}
          {/*  <TextField */}
          {/*    key={item[0]} */}
          {/*    size='small' */}
          {/*    type='text' */}
          {/*    fullWidth */}
          {/*    defaultValue={item[Object.keys(item)]} */}
          {/*    required */}
          {/*    className='mr-10' */}
          {/*    label='Value' */}
          {/*    onChange={(e) => handleOnChangeComponent(e.target.value, index, 'values')} */}
          {/*  /> */}
          {/* ))} */}
        </div>
      ) : (
        ''
      )}
      <Box display='flex' justifyContent='space-between' className='mb-12'>
        <div>
          {!showItem ? (
            <TextField
              size='small'
              type='text'
              fullWidth
              defaultValue={component.name}
              required
              disabled
              className='mr-10'
              label='Name'
            />
          ) : (
            ''
          )}
        </div>
        <div>
          <Button onClick={() => handleShowItem(index)}>{showItem ? 'Hide' : 'Show'}</Button>
          <Button onClick={() => handleDeleteComponent(component.name, index)}>Delete</Button>
        </div>
      </Box>
    </div>
  );
};

export default ComponentItem;
