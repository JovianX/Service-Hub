import { Button } from '@mui/material';
import { useState } from 'react';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import ComponentsBuilder from './ComponentsBuilder/ComponentsBuilder';
import InputsBuilder from './InputsBuilder/InputsBuilder';

const TemplateBuilder = ({ templateBuilder, setTemplateBuilder }) => {
  const [isOpenComponents, setIsOpenComponents] = useState(false);
  const [isOpenInputs, setIsOpenInputs] = useState(false);

  return (
    <>
      <Button
        className='group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer'
        onClick={() => setIsOpenComponents(true)}
      >
        <FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>
        <span className='ml-8 font-medium text-secondary group-hover:underline'>Add a Component</span>
      </Button>

      <ComponentsBuilder
        components={templateBuilder?.components ? templateBuilder.components : null}
        setTemplateBuilder={setTemplateBuilder}
        isOpenComponents={isOpenComponents}
        setIsOpenComponents={setIsOpenComponents}
      />

      <Button
        className='group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer'
        onClick={() => setIsOpenInputs(true)}
      >
        <FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>
        <span className='ml-8 font-medium text-secondary group-hover:underline'>Add a Input</span>
      </Button>

      <InputsBuilder
        inputs={templateBuilder?.inputs ? templateBuilder.inputs : null}
        setTemplateBuilder={setTemplateBuilder}
        isOpenInputs={isOpenInputs}
        setIsOpenInputs={setIsOpenInputs}
      />
    </>
  );
};

export default TemplateBuilder;
