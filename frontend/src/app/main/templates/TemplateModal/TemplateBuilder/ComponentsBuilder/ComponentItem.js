import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { useCallback, useContext } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

import ChartSelector from './ComponentSelectors/ChartSelector';
import TypeSelector from './ComponentSelectors/TypeSelector';
import ValuesInputs from './ComponentSelectors/ValuesInputs';
import VersionSelector from './ComponentSelectors/VersionSelector';

const values = [
  {
    key1: {
      key2: {
        key3: '',
      },
    },
  },
];

const ComponentItem = ({ component, index, setIndex, setSelectedIndex }) => {
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
    setSelectedIndex(0);
    setIndex(0);
    setTemplateBuilder((template) => {
      let { components } = template;
      components = [...components.filter((item, i) => i !== index)];
      return { ...template, components };
    });
  };

  const handleAddValues = (index) => {
    setTemplateBuilder((template) => {
      const { components } = template;
      if (components[index].values?.length > 0) {
        components[index].values = [...components[index].values, ...values];
      } else {
        components[index].values = [...values];
      }

      return { ...template, components };
    });
  };

  const onRecursValues = (item, value = []) => {
    if (item[Object.keys(item)[0]] && typeof item[Object.keys(item)[0]] === 'object') {
      value = [...value, ...Object.keys(item)];
      return onRecursValues(item[Object.keys(item)[0]], value);
    }
    value = [...value, ...Object.keys(item), ...Object.values(item)];
    return value;
  };

  const handleDeleteComponentValues = (inputIndex, optionIndex) => {
    setTemplateBuilder((template) => {
      const { components } = template;
      const values = components[inputIndex].values.filter((item, index) => index !== optionIndex);
      components[inputIndex].values = values;

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
        <ChartSelector chartValue={component.chart} index={index} handleOnChangeComponent={handleOnChangeComponent} />
        <VersionSelector
          versionValue={component.version}
          index={index}
          handleOnChangeComponent={handleOnChangeComponent}
        />
        {component?.values?.length ? (
          <p className='col-span-2 mb-12'>Values</p>
        ) : (
          <div className='col-span-2 mb-12 hover:cursor-pointer' onClick={() => handleAddValues(index)}>
            Add Values
          </div>
        )}

        {component?.values?.map((item, nestedIndex) => {
          const value = onRecursValues(item);
          return (
            <ValuesInputs
              key={nestedIndex}
              value={value}
              index={index}
              nestedIndex={nestedIndex}
              handleDeleteComponentValues={handleDeleteComponentValues}
            />
          );
        })}

        {component.values?.length > 0 && (
          <div className='col-span-2 mb-12 hover:cursor-pointer' onClick={() => handleAddValues(index)}>
            Add another value
          </div>
        )}
      </div>
      <Box display='flex' justifyContent='end' className='mb-12'>
        <Button onClick={() => handleDeleteComponent(index)}>Delete</Button>
      </Box>
    </div>
  );
};

export default ComponentItem;
