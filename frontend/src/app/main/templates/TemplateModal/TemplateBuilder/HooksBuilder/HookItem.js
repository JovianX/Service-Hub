import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import yaml from 'js-yaml';
import { useCallback, useContext } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

import HookFields from './HookFields';
import HookTypes from './HookTypes';

const newHook = {
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
};

const HookItem = ({ hook, index, selectedHook, infoIsYamlValid }) => {
  const { setTemplateBuilder } = useContext(TemplateContext);

  const handleOnChangeHook = useCallback((value, index, type) => {
    setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      let hooks = Object.entries(template.hooks);

      if (type === 'type') {
        hooks[index][0] = value;
      }
      hooks = Object.fromEntries(hooks);

      return yaml.dump({ ...template, hooks }, { skipInvalid: true });
    });
  }, []);

  const handleAddNewHook = (index) => {
    setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });

      let hooks = Object.entries(template.hooks);

      let updatedHooks = hooks;
      updatedHooks = [...updatedHooks.find((_, i) => i === index)[1], newHook];
      hooks[index][1] = updatedHooks;
      hooks = Object.fromEntries(hooks);

      return yaml.dump({ ...template, hooks }, { skipInvalid: true });
    });
  };

  return (
    <div className='template-builder bg-deep-purple-50 bg-opacity-50 p-12'>
      <div className='grid grid-cols-2 gap-10'>
        {hook[0] === '' ? (
          <HookTypes
            typeValue={hook[0]}
            index={index}
            handleOnChangeHook={handleOnChangeHook}
            infoIsYamlValid={infoIsYamlValid}
          />
        ) : (
          <>
            {hook[1].length > 0 ? (
              <HookFields
                indexOfTypeHook={index}
                indexOfSelectedHook={selectedHook}
                hookFields={hook[1][selectedHook]}
                infoIsYamlValid={infoIsYamlValid}
              />
            ) : (
              <Button
                disabled={!!infoIsYamlValid}
                color='primary'
                startIcon={<AddIcon />}
                onClick={() => handleAddNewHook(index)}
              >
                New hook
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HookItem;
