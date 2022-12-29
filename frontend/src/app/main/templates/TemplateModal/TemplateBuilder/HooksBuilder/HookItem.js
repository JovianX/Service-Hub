import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import yaml from 'js-yaml';
import { useCallback, useContext } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

import HookFields from './HookFields';
import HookTypes from './HookTypes';

const HookItem = ({ hook, selectedIndexHookType, selectedHook, infoIsYamlValid, handleAddNewHook, setActionType }) => {
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
    setActionType('');
  }, []);

  return (
    <div className='template-builder bg-deep-purple-50 bg-opacity-50 p-12'>
      <div className='grid grid-cols-2 gap-10'>
        {hook[0] === '' ? (
          <HookTypes
            typeValue={hook[0]}
            index={selectedIndexHookType}
            handleOnChangeHook={handleOnChangeHook}
            infoIsYamlValid={infoIsYamlValid}
          />
        ) : (
          <>
            {hook[1].length > 0 ? (
              <HookFields
                indexOfTypeHook={selectedIndexHookType}
                indexOfSelectedHook={selectedHook}
                hookFields={hook[1][selectedHook]}
                infoIsYamlValid={infoIsYamlValid}
                setActionType={setActionType}
              />
            ) : (
              <Button
                disabled={!!infoIsYamlValid}
                color='primary'
                startIcon={<AddIcon />}
                onClick={() => handleAddNewHook(selectedIndexHookType)}
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
