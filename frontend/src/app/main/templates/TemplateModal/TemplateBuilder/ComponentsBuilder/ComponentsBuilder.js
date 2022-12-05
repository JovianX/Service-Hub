import { Divider, List, ListItemButton, ListItemText } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

import ComponentItem from './ComponentItem';

const newComponents = [
  {
    name: '',
    type: '',
    chart: '',
    version: '',
  },
];

const ComponentsBuilder = () => {
  const { templateBuilder, setTemplateBuilder } = useContext(TemplateContext);
  const [index, setIndex] = useState(0);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const components = useMemo(() => {
    if (!templateBuilder?.components) {
      return null;
    }
    return templateBuilder.components;
  }, [templateBuilder]);

  const component = useMemo(() => {
    if (!components) {
      return null;
    }
    return components[index];
  }, [components, index]);

  useEffect(() => {
    if (!components) {
      setTemplateBuilder((template) => ({ ...template, components: newComponents }));
    }
  }, [components]);

  const handleAddAnotherComponent = () => {
    setTemplateBuilder((template) => {
      let { components } = template;
      components = [...components, ...newComponents];
      return { ...template, components };
    });
  };

  const handleShowComponent = (index) => {
    setIndex(index);
    setSelectedIndex(index);
  };

  return (
    <>
      {components?.length ? (
        <Box display='flex' justifyContent='space-between'>
          <List className='w-2/5 pt-0 h-[70vh] overflow-y-scroll mr-12'>
            {components?.map((component, index) => (
              <React.Fragment key={index}>
                <ListItemButton
                  className='hover:cursor-pointer'
                  style={{ borderLeft: selectedIndex === index ? '3px solid #2A3BAB' : '' }}
                  selected={selectedIndex === index}
                  onClick={() => handleShowComponent(index)}
                >
                  <ListItemText>
                    {component.name ? component.name : 'name'} - {component.type ? component.type : 'type'}
                  </ListItemText>
                </ListItemButton>
                <Divider variant='fullWidth' component='li' />
              </React.Fragment>
            ))}
            <Box>
              <Button onClick={handleAddAnotherComponent}>Add another component</Button>
            </Box>
          </List>

          <Box className='w-3/5'>
            <ComponentItem
              component={component}
              index={index}
              setIndex={setIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </Box>
        </Box>
      ) : (
        <Box>
          <Button onClick={handleAddAnotherComponent}>Add a component</Button>
        </Box>
      )}
    </>
  );
};

export default ComponentsBuilder;
