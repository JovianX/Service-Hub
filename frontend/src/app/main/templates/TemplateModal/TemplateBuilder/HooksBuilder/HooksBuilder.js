import AddIcon from '@mui/icons-material/Add';
import { Divider, List, ListItemButton, ListItemText } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import yaml from 'js-yaml';
import React, { useContext, useMemo, useState } from 'react';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { TemplateContext } from '../../../TemplateProvider';

const newHooks = [
  {
    key: [
      {
        name: '',
        type: 'kubernetes_job',
        image: '',
        enabled: true,
      },
    ],
  },
];

const HooksBuilder = ({ hooks }) => {
  const { setTemplateBuilder, infoIsYamlValid } = useContext(TemplateContext);

  const [index, setIndex] = useState(0);
  const [actionType, setActionType] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hook = useMemo(() => {
    if (!hooks) {
      return null;
    }
    return hooks[index];
  }, [hooks, index]);

  const handleShowHook = (index) => {
    setActionType('');
    setIndex(index);
    setSelectedIndex(index);
  };

  const handleAddAnotherHook = () => {
    setActionType('ADD');
    setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      let hooks;
      if (template?.hooks) {
        hooks = template.hooks;
      } else {
        hooks = [];
      }
      hooks = [...hooks, ...newHooks];
      return yaml.dump({ ...template, hooks }, { skipInvalid: true });
    });
  };

  return (
    <>
      {hooks && hooks?.length ? (
        <Box display='flex' justifyContent='space-between'>
          <List className='w-2/5 pt-0 h-full overflow-y-scroll mr-12'>
            {hooks?.map((component, index) => (
              <React.Fragment key={index}>
                <ListItemButton
                  className='group hover:cursor-pointer min-h-[50px]'
                  style={{ borderLeft: selectedIndex === index ? '3px solid #2A3BAB' : '' }}
                  selected={selectedIndex === index}
                  onClick={() => handleShowHook(index)}
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
              onClick={handleAddAnotherHook}
            >
              New hook
            </Button>
          </List>

          {hook ? <Box className='w-3/5' /> : ''}
        </Box>
      ) : (
        <Box>
          <Button
            disabled={!!infoIsYamlValid}
            color='primary'
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleAddAnotherHook}
          >
            New hook
          </Button>
        </Box>
      )}
    </>
  );
};
export default HooksBuilder;
