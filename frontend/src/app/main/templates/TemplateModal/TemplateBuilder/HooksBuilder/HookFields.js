import AddIcon from '@mui/icons-material/Add';
import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import yaml from 'js-yaml';
import React, { useContext, useEffect, useState } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

const ENV = {
  name: '',
  value: '',
};

const COMMAND = '';
const ARGS = '';

const HookFields = ({ indexOfTypeHook, indexOfSelectedHook, hookFields, infoIsYamlValid }) => {
  const { setTemplateBuilder } = useContext(TemplateContext);
  const [hookFieldsInArray, setHookFieldsInArray] = useState([]);

  useEffect(() => {
    if (hookFields) setHookFieldsInArray(Object.entries(hookFields));
  }, [hookFields]);

  const handleDeleteHookOption = (nestedIndexOfEnv, type) => {
    setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      let hooks = Object.entries(template.hooks);

      let updatedEnv = hooks;
      updatedEnv = updatedEnv[indexOfTypeHook][1][indexOfSelectedHook][type].filter((_, i) => i !== nestedIndexOfEnv);
      hooks[indexOfTypeHook][1][indexOfSelectedHook][type] = updatedEnv;

      hooks = Object.fromEntries(hooks);
      return yaml.dump({ ...template, hooks }, { skipInvalid: true });
    });
  };

  const handleAddNewHookOption = (type) => {
    let subjectForAdd;
    if (type === 'env') subjectForAdd = ENV;
    if (type === 'command') subjectForAdd = COMMAND;
    if (type === 'args') subjectForAdd = ARGS;

    setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      let hooks = Object.entries(template.hooks);

      let updatedHookOption = hooks;
      updatedHookOption = [...updatedHookOption[indexOfTypeHook][1][indexOfSelectedHook][type], subjectForAdd];

      hooks[indexOfTypeHook][1][indexOfSelectedHook][type] = updatedHookOption;

      hooks = Object.fromEntries(hooks);
      return yaml.dump({ ...template, hooks }, { skipInvalid: true });
    });
  };

  return (
    <>
      {hookFieldsInArray.length > 0 &&
        hookFieldsInArray.map((field, index) => {
          return (
            <React.Fragment key={index}>
              {!Array.isArray(field[1]) ? (
                <>
                  <p className='flex items-center'>{field[0]}</p>
                  <TextField
                    size='small'
                    label={field[0]}
                    value={field[1]}
                    required={
                      !!(field[0] === 'name' || field[0] === 'type' || field[0] === 'type' || field[0] === 'image')
                    }
                  />
                </>
              ) : (
                <>
                  <p className='col-span-2'>{field[0]}</p>
                  {field[1].length > 0 ? (
                    field[1].map((item, optionIndex) => (
                      <React.Fragment key={optionIndex}>
                        {field[0] === 'env' ? (
                          <>
                            <TextField type='text' size='small' label='Name' value={item.name} />
                            <TextField type='text' size='small' label='Value' value={item.value} />
                            <Box display='flex' justifyContent='end' className='col-span-2 mt-[-10px]'>
                              <Button
                                disabled={!!infoIsYamlValid}
                                onClick={() => handleDeleteHookOption(optionIndex, field[0])}
                              >
                                Delete env
                              </Button>
                            </Box>
                          </>
                        ) : null}
                        {field[0] === 'env' && optionIndex === field[1].length - 1 && (
                          <Button
                            disabled={!!infoIsYamlValid}
                            className='mt-[-10px] col-span-2 justify-start'
                            color='primary'
                            startIcon={<AddIcon />}
                            onClick={() => handleAddNewHookOption(field[0])}
                          >
                            New env
                          </Button>
                        )}
                        {field[0] === 'args' || field[0] === 'command' ? (
                          <>
                            <TextField size='small' className='col-span-2' value={item} />
                            {field[0] === 'args' && (
                              <Box display='flex' justifyContent='end' className='col-span-2 mt-[-10px]'>
                                <Button
                                  disabled={!!infoIsYamlValid}
                                  onClick={() => handleDeleteHookOption(optionIndex, field[0])}
                                >
                                  Delete args
                                </Button>
                              </Box>
                            )}
                            {field[0] === 'args' && optionIndex === field[1].length - 1 && (
                              <Button
                                disabled={!!infoIsYamlValid}
                                className='mt-[-10px] col-span-2 justify-start'
                                color='primary'
                                startIcon={<AddIcon />}
                                onClick={() => handleAddNewHookOption(field[0])}
                              >
                                New args
                              </Button>
                            )}
                            {field[0] === 'command' && (
                              <Box display='flex' justifyContent='end' className='col-span-2 mt-[-10px]'>
                                <Button
                                  disabled={!!infoIsYamlValid}
                                  onClick={() => handleDeleteHookOption(optionIndex, field[0])}
                                >
                                  Delete command
                                </Button>
                              </Box>
                            )}
                            {field[0] === 'command' && optionIndex === field[1].length - 1 && (
                              <Button
                                disabled={!!infoIsYamlValid}
                                className='mt-[-10px] col-span-2 justify-start'
                                color='primary'
                                startIcon={<AddIcon />}
                                onClick={() => handleAddNewHookOption(field[0])}
                              >
                                New command
                              </Button>
                            )}
                          </>
                        ) : null}
                      </React.Fragment>
                    ))
                  ) : (
                    <Button
                      disabled={!!infoIsYamlValid}
                      className='mt-[-10px] col-span-2 justify-start'
                      color='primary'
                      startIcon={<AddIcon />}
                      onClick={() => handleAddNewHookOption(field[0])}
                    >
                      New {field[0]}
                    </Button>
                  )}
                </>
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};
export default HookFields;
