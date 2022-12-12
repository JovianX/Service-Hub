import AddIcon from '@mui/icons-material/Add';
import { Divider, List, ListItemButton, ListItemText } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import yaml from 'js-yaml';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { TemplateContext } from '../../../TemplateProvider';

import ComponentItem from './ComponentItem';

const newComponents = [
  {
    name: '',
    type: '',
    chart: '',
  },
];

const ComponentsBuilder = ({ components }) => {
  const { setTemplateBuilder, infoIsYamlValid } = useContext(TemplateContext);

  const [index, setIndex] = useState(0);
  const [actionType, setActionType] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const component = useMemo(() => {
    if (!components) {
      return null;
    }
    return components[index];
  }, [components, index]);

  useEffect(() => {
    if (actionType === 'ADD') {
      setIndex(components.length - 1);
      setSelectedIndex(components.length - 1);
    }
  }, [components]);

  const handleShowComponent = (index) => {
    setActionType('');
    setIndex(index);
    setSelectedIndex(index);
  };

  const handleAddAnotherComponent = () => {
    setActionType('ADD');
    setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      let components;
      if (template?.components) {
        components = template.components;
      } else {
        components = [];
      }
      components = [...components, ...newComponents];
      return yaml.dump({ ...template, components }, { skipInvalid: true });
    });
  };

  const handleDeleteComponent = async (index) => {
    await setActionType('');
    await setSelectedIndex(0);
    await setIndex(0);
    await setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      let { components } = template;
      components = [...components.filter((item, i) => i !== index)];
      return yaml.dump({ ...template, components }, { skipInvalid: true });
    });
  };

  return (
    <>
      {components && components?.length ? (
        <Box display='flex' justifyContent='space-between'>
          <List className='w-2/5 pt-0 h-full overflow-y-scroll mr-12'>
            {components?.map((component, index) => (
              <React.Fragment key={index}>
                <ListItemButton
                  className='group hover:cursor-pointer min-h-[50px]'
                  style={{ borderLeft: selectedIndex === index ? '3px solid #2A3BAB' : '' }}
                  selected={selectedIndex === index}
                  onClick={() => handleShowComponent(index)}
                >
                  <ListItemText>
                    {component?.name ? component?.name : 'name'} - {component?.type ? component?.type : 'type'}
                  </ListItemText>

                  <Button
                    disabled={!!infoIsYamlValid}
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
              disabled={!!infoIsYamlValid}
              className='mt-12'
              color='primary'
              variant='contained'
              startIcon={<AddIcon />}
              onClick={handleAddAnotherComponent}
            >
              New component
            </Button>
          </List>

          {component ? (
            <Box className='w-3/5'>
              <ComponentItem component={component} index={index} infoIsYamlValid={infoIsYamlValid} />
            </Box>
          ) : (
            ''
          )}
        </Box>
      ) : (
        <Box>
          <Button
            disabled={!!infoIsYamlValid}
            color='primary'
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleAddAnotherComponent}
          >
            New component
          </Button>
        </Box>
      )}
    </>
  );
};

export default ComponentsBuilder;
