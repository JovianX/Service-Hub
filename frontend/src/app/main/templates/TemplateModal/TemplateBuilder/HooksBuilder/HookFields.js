import AddIcon from '@mui/icons-material/Add';
import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import yaml from 'js-yaml';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

import CreateAdditionalField from './CreateAdditionalField';
import SelectorOfHookType from './SelectorOfHookType';

const ENV = {
  name: '',
  value: '',
};

const COMMAND = '';
const ARGS = '';

const HookFields = ({ indexOfTypeHook, indexOfSelectedHook, hookFields, infoIsYamlValid, setActionType }) => {
  const { setTemplateBuilder } = useContext(TemplateContext);
  const [hookFieldsInArray, setHookFieldsInArray] = useState([]);
  const [type, setType] = useState('');

  useEffect(() => {
    if (hookFields) {
      setHookFieldsInArray(Object.entries(hookFields));
      setActionType('');
    }
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

  const handleOnChangeHook = useCallback(
    (type, value) => {
      setTemplateBuilder((configYamlText) => {
        const template = yaml.load(configYamlText, { json: true });
        let hooks = Object.entries(template.hooks);

        hooks[indexOfTypeHook][1][indexOfSelectedHook][type] = value;

        hooks = Object.fromEntries(hooks);
        return yaml.dump({ ...template, hooks }, { skipInvalid: true });
      });
    },
    [indexOfTypeHook, indexOfSelectedHook],
  );

  const handleOnChangeHookEvn = useCallback(
    (nestedEnvIndex, type, nestedType, value) => {
      setTemplateBuilder((configYamlText) => {
        const template = yaml.load(configYamlText, { json: true });
        let hooks = Object.entries(template.hooks);

        const updatedHookEnv = hooks[indexOfTypeHook][1][indexOfSelectedHook][type][nestedEnvIndex];

        if (nestedType === 'name') {
          updatedHookEnv[Object.keys(updatedHookEnv)[0]] = value;
          hooks[indexOfTypeHook][1][indexOfSelectedHook][type][nestedEnvIndex] = updatedHookEnv;
        }
        if (nestedType === 'value') {
          updatedHookEnv[Object.keys(updatedHookEnv)[1]] = value;
          hooks[indexOfTypeHook][1][indexOfSelectedHook][type][nestedEnvIndex] = updatedHookEnv;
        }

        hooks = Object.fromEntries(hooks);
        return yaml.dump({ ...template, hooks }, { skipInvalid: true });
      });
    },
    [indexOfTypeHook, indexOfSelectedHook],
  );

  const handleOnChangeHookArray = useCallback(
    (nestedArrayIndex, type, value) => {
      setTemplateBuilder((configYamlText) => {
        const template = yaml.load(configYamlText, { json: true });
        let hooks = Object.entries(template.hooks);

        const updatedHookEnv = hooks[indexOfTypeHook][1][indexOfSelectedHook][type];
        updatedHookEnv[nestedArrayIndex] = value;

        hooks[indexOfTypeHook][1][indexOfSelectedHook][type] = updatedHookEnv;
        hooks = Object.fromEntries(hooks);
        return yaml.dump({ ...template, hooks }, { skipInvalid: true });
      });
    },
    [indexOfTypeHook, indexOfSelectedHook],
  );

  return (
    <>
      {hookFieldsInArray.length > 0 &&
        hookFieldsInArray.map((field, index) => {
          return (
            <React.Fragment key={index}>
              {!Array.isArray(field[1]) ? (
                <>
                  {field[0] === 'type' ? (
                    <SelectorOfHookType
                      typeValue={field[1]}
                      label={field[0]}
                      infoIsYamlValid={infoIsYamlValid}
                      handleOnChangeHook={handleOnChangeHook}
                      type={type}
                      setType={setType}
                    />
                  ) : (
                    <TextField
                      className='col-span-2'
                      size='small'
                      label={field[0]}
                      value={field[1] || ''}
                      required={
                        !!(field[0] === 'name' || field[0] === 'type' || field[0] === 'type' || field[0] === 'image')
                      }
                      disabled={!!infoIsYamlValid}
                      onChange={(e) => handleOnChangeHook(field[0], e.target.value)}
                    />
                  )}
                </>
              ) : (
                <>
                  <p className='col-span-2'>{field[0]}</p>
                  {field[1].length > 0 ? (
                    field[1].map((item, optionIndex) => (
                      <React.Fragment key={optionIndex}>
                        {field[0] === 'env' ? (
                          <>
                            <TextField
                              type='text'
                              size='small'
                              label='Name'
                              value={item.name || ''}
                              disabled={!!infoIsYamlValid}
                              onChange={(e) => handleOnChangeHookEvn(optionIndex, field[0], 'name', e.target.value)}
                            />
                            <TextField
                              type='text'
                              size='small'
                              label='Value'
                              value={item.value || ''}
                              disabled={!!infoIsYamlValid}
                              onChange={(e) => handleOnChangeHookEvn(optionIndex, field[0], 'value', e.target.value)}
                            />
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
                            <TextField
                              size='small'
                              className='col-span-2'
                              value={item || ''}
                              disabled={!!infoIsYamlValid}
                              onChange={(e) => handleOnChangeHookArray(optionIndex, field[0], e.target.value)}
                            />
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

      {hookFieldsInArray.length > 0 ? (
        <CreateAdditionalField
          hookFieldsInArray={hookFieldsInArray}
          infoIsYamlValid={infoIsYamlValid}
          indexOfTypeHook={indexOfTypeHook}
          indexOfSelectedHook={indexOfSelectedHook}
          hookType={type}
        />
      ) : null}
    </>
  );
};
export default HookFields;
