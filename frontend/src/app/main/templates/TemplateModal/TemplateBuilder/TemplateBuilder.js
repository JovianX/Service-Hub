import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import { useContext, useEffect, useMemo, useState } from 'react';

import { TemplateContext } from '../../TemplateProvider';

import ComponentsBuilder from './ComponentsBuilder/ComponentsBuilder';
import HooksBuilder from './HooksBuilder/HooksBuilder';
import InputsBuilder from './InputsBuilder/InputsBuilder';

const TemplateBuilder = () => {
  const [alignment, setAlignment] = useState('components');
  const [changedTemplatesBuilder, setChangedTemplatesBuilder] = useState({});

  const { infoIsYamlValid, templateBuilder } = useContext(TemplateContext);

  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const components = useMemo(() => {
    if (!changedTemplatesBuilder?.components) {
      return null;
    }

    return changedTemplatesBuilder.components;
  }, [changedTemplatesBuilder]);

  const inputs = useMemo(() => {
    if (!changedTemplatesBuilder?.inputs) {
      return null;
    }
    return changedTemplatesBuilder.inputs;
  }, [changedTemplatesBuilder]);

  const hooks = useMemo(() => {
    if (!changedTemplatesBuilder?.hooks) {
      return null;
    }
    return changedTemplatesBuilder.hooks;
  }, [changedTemplatesBuilder]);

  useEffect(() => {
    if (templateBuilder) {
      setChangedTemplatesBuilder(templateBuilder);
    }
  }, [templateBuilder]);

  return (
    <Box className='mt-12'>
      <Box className='overflow-y-scroll' style={{ height: 'calc(100vh - 430px)' }}>
        <Box className='mr-12'>
          <ToggleButtonGroup color='primary' value={alignment} exclusive onChange={handleChangeAlignment}>
            <ToggleButton size='small' value='components'>
              Components
            </ToggleButton>
            <ToggleButton size='small' value='inputs' className='w-[110px]'>
              Inputs
            </ToggleButton>
            <ToggleButton size='small' value='hooks' className='w-[110px]'>
              Hooks
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box className='mt-24 h-max'>
          {alignment === 'components' && <ComponentsBuilder components={components} />}
          {alignment === 'inputs' && <InputsBuilder inputs={inputs} />}
          {alignment === 'hooks' && <HooksBuilder hooks={hooks} />}
        </Box>
      </Box>
      <div className='mt-3 min-h-[30px] flex justify-center items-end'>
        {infoIsYamlValid && <p className='text-red'>{infoIsYamlValid}</p>}
      </div>
    </Box>
  );
};

export default TemplateBuilder;
