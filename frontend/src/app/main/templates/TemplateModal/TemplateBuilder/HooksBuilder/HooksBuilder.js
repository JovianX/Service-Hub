import AddIcon from '@mui/icons-material/Add';
import { Timeline, TimelineDot, TimelineItem } from '@mui/lab';
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import { Divider, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import yaml from 'js-yaml';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { TemplateContext } from '../../../TemplateProvider';

import HookItem from './HookItem';

const newHooks = {
  '': [
    {
      name: '',
      type: '',
      image: '',
      enabled: false,
      namespace: '',
      on_failure: '',
      timeout: 0,
      command: [],
      args: [],
      env: [],
    },
  ],
};

const HooksBuilder = ({ hooks }) => {
  const { setTemplateBuilder, infoIsYamlValid } = useContext(TemplateContext);

  const [actionType, setActionType] = useState('');

  const [indexHookType, setIndexHookType] = useState(0);
  const [selectedIndexHookType, setSelectedIndexHookType] = useState(0);
  const [selectedHook, setSelectedHook] = useState(0);

  useEffect(() => {
    if (actionType === 'ADD') {
      setIndexHookType(hooks.length - 1);
      setSelectedIndexHookType(hooks.length - 1);
      setSelectedHook(0);
    }
  }, [hooks]);

  const hook = useMemo(() => {
    if (!hooks) {
      return null;
    }

    return hooks[indexHookType];
  }, [hooks, indexHookType]);

  const handleShowHook = (index) => {
    setIndexHookType(index);
    setSelectedIndexHookType(index);
  };

  const handleAddTypeOfHook = () => {
    setActionType('ADD');
    setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      let hooks;

      if (template?.hooks) {
        hooks = template.hooks;
      } else {
        hooks = {};
      }
      hooks = { ...hooks, ...newHooks };
      return yaml.dump({ ...template, hooks }, { skipInvalid: true });
    });
  };

  const handleDeleteHook = async (index, indexHook) => {
    await setActionType('');

    await setIndexHookType(0);
    await setSelectedIndexHookType(0);
    await setSelectedHook(0);

    await setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      let hooks = Object.entries(template.hooks);

      let updatedHooks = hooks;
      updatedHooks = updatedHooks.find((_, i) => i === index)[1].filter((_, i) => i !== indexHook);
      hooks[index][1] = updatedHooks;

      hooks = Object.fromEntries(hooks);
      return yaml.dump({ ...template, hooks }, { skipInvalid: true });
    });
  };

  return (
    <>
      {hooks?.length ? (
        <Box display='flex' justifyContent='space-between'>
          <List className='w-2/5 pt-0 h-full overflow-y-scroll mr-12'>
            {hooks?.map((itemHook, index) => (
              <React.Fragment key={index}>
                <ListItemButton
                  style={{ borderLeft: selectedIndexHookType === index ? '3px solid #2A3BAB' : '', background: 'none' }}
                  onClick={() => {
                    handleShowHook(index);
                  }}
                >
                  <ListItemText>
                    <div className='flex justify-between'>
                      <Typography component='p' variant='h6'>
                        {itemHook[0]}
                      </Typography>
                    </div>
                    <Timeline
                      className='px-0'
                      sx={{
                        [`& .${timelineItemClasses.root}:before`]: {
                          flex: 0,
                          padding: 0,
                          paddingRight: 0,
                        },
                      }}
                    >
                      {itemHook[1] &&
                        itemHook[1]?.map((item, indexHook) => {
                          return (
                            <TimelineItem className='group min-h-[40px]' key={indexHook}>
                              <TimelineDot />

                              <Box
                                className={`${
                                  selectedIndexHookType === index && selectedHook === indexHook && 'bg-blue/[.06]'
                                }  ease-in duration-300 hover:bg-gray-400/[.08] ml-12 w-full `}
                                onClick={() => {
                                  setSelectedHook(indexHook);
                                  handleShowHook(index);
                                }}
                              >
                                <Box
                                  display='flex'
                                  justifyContent='space-between'
                                  alignItems='center'
                                  height='100%'
                                  px='8px'
                                >
                                  <Typography component='p' variant='caption'>
                                    {item.name}
                                  </Typography>

                                  <Button
                                    disabled={!!infoIsYamlValid}
                                    className='hidden group-hover:flex'
                                    variant='text'
                                    color='error'
                                    size='small'
                                    onClick={() => handleDeleteHook(index, indexHook)}
                                  >
                                    <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                                  </Button>
                                </Box>
                              </Box>
                            </TimelineItem>
                          );
                        })}
                    </Timeline>
                  </ListItemText>
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
              onClick={handleAddTypeOfHook}
            >
              New type of hook
            </Button>
          </List>

          {hook ? (
            <Box className='w-3/5'>
              <HookItem
                hook={hook}
                selectedHook={selectedHook}
                index={indexHookType}
                infoIsYamlValid={infoIsYamlValid}
              />
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
            onClick={handleAddTypeOfHook}
          >
            New hook
          </Button>
        </Box>
      )}
    </>
  );
};
export default HooksBuilder;
