import AddIcon from '@mui/icons-material/Add';
import { Divider, List, ListItemButton, ListItemText } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

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
  const [actionType, setActionType] = useState('');

  const [selectedIndex, setSelectedIndex] = useState(0);

  const components = useMemo(() => {
    if (!templateBuilder?.components) {
      return null;
    }
    if (actionType === 'ADD') {
      setIndex(templateBuilder.components.length - 1);
      setSelectedIndex(templateBuilder.components.length - 1);
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

  const handleShowComponent = (index) => {
    setActionType('');
    setIndex(index);
    setSelectedIndex(index);
  };

  const handleAddAnotherComponent = () => {
    setActionType('ADD');
    setTemplateBuilder((template) => {
      let { components } = template;
      components = [...components, ...newComponents];
      return { ...template, components };
    });
  };

  const handleDeleteComponent = async (index) => {
    await setActionType('');
    await setSelectedIndex(0);
    await setIndex(0);
    await setTemplateBuilder((template) => {
      let { components } = template;
      components = [...components.filter((item, i) => i !== index)];
      return { ...template, components };
    });
  };

  return (
    <>
      {components?.length ? (
        <Box display='flex' justifyContent='space-between'>
          <List className='w-2/5 pt-0 h-[70vh] overflow-y-scroll mr-12'>
            {components?.map((component, index) => (
              <React.Fragment key={index}>
                <ListItemButton
                  className='group hover:cursor-pointer min-h-[50px]'
                  style={{ borderLeft: selectedIndex === index ? '3px solid #2A3BAB' : '' }}
                  selected={selectedIndex === index}
                  onClick={() => handleShowComponent(index)}
                >
                  <ListItemText>
                    {component.name ? component.name : 'name'} - {component.type ? component.type : 'type'}
                  </ListItemText>

                  <Button
                    className='hidden group-hover:flex'
                    variant='text'
                    color='error'
                    size='small'
                    onClick={() => handleDeleteComponent(index)}
                  >
                    <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                  </Button>
                </ListItemButton>
                <Divider variant='fullWidth' component='li' />
              </React.Fragment>
            ))}
            <Button
              className='mt-12'
              color='primary'
              variant='contained'
              startIcon={<AddIcon />}
              onClick={handleAddAnotherComponent}
            >
              New component
            </Button>
          </List>

          <Box className='w-3/5'>
            <ComponentItem component={component} index={index} />
          </Box>
        </Box>
      ) : (
        <Box>
          <Button color='primary' variant='contained' startIcon={<AddIcon />} onClick={handleAddAnotherComponent}>
            New component
          </Button>
        </Box>
      )}
    </>
  );
};

export default ComponentsBuilder;
