import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useCallback, useContext } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

import ChartSelector from './ComponentSelectors/ChartSelector';
import TypeSelector from './ComponentSelectors/TypeSelector';
import ValuesInputs from './ComponentSelectors/ValuesInputs';
import VersionSelector from './ComponentSelectors/VersionSelector';

const values = [
  {
    key: '',
  },
];

const ComponentItem = ({ component, index }) => {
  const { setTemplateBuilder } = useContext(TemplateContext);

  const handleOnChangeComponent = useCallback((value, index, type, nestedIndex, nestedType) => {
    setTemplateBuilder((template) => {
      const components = template?.components || [];
      const component = components[index] || {};

      if (nestedIndex !== undefined && nestedType) {
        const valueForChange = component[type][nestedIndex];

        if (nestedType === 'value') {
          valueForChange[Object.keys(valueForChange)[0]] = value;
          component[type][nestedIndex] = valueForChange;
          return { ...template, components };
        }
        if (nestedType === 'key') {
          component[type][nestedIndex] = {
            [value]: valueForChange[Object.keys(valueForChange)[0]],
          };
          return { ...template, components };
        }
      }

      component[type] = value;
      components[index] = component;

      return { ...template, components };
    });
  }, []);

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
      components[inputIndex].values = components[inputIndex].values.filter((item, index) => index !== optionIndex);

      return { ...template, components };
    });
  };

  return (
    <div className='template-builder bg-deep-purple-50 bg-opacity-50 p-12'>
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
          <Button
            className='mb-12  justify-start'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => handleAddValues(index)}
          >
            New value
          </Button>
        )}

        {component?.values?.map((item, nestedIndex) => {
          let value = [];
          try {
            if (item[Object.keys(item)] !== undefined && typeof item[Object.keys(item)] === 'object') {
              value = onRecursValues(item);
            } else {
              value = item;
            }
          } catch (e) {
            throw new Error(e);
          }

          return (
            <ValuesInputs
              key={nestedIndex}
              value={value}
              index={index}
              nestedIndex={nestedIndex}
              handleOnChangeComponent={handleOnChangeComponent}
              handleDeleteComponentValues={handleDeleteComponentValues}
            />
          );
        })}

        {component.values?.length > 0 && (
          <Button
            className='mb-12 justify-start'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => handleAddValues(index)}
          >
            New value
          </Button>
        )}
      </div>
    </div>
  );
};

export default ComponentItem;
