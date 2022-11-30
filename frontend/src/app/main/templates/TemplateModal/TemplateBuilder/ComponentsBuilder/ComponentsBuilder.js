import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

import ComponentItem from './ComponentItem';

const newComponent = [
  {
    name: '',
    type: '',
    chart: '',
    version: '',
    values: [{ key: '' }],
  },
];

const ComponentsBuilder = ({ isOpenComponents, setIsOpenComponents, components, setTemplateBuilder }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isOpenComponents) {
      setOpen(true);
      setIsOpenComponents(false);
    }
  }, [isOpenComponents]);

  useEffect(() => {
    if (!components) {
      setTemplateBuilder({ components: newComponent });
    }
  }, [components]);

  const handleAddAnotherComponent = () => {
    setTemplateBuilder((template) => {
      let { components } = template;
      components = [...components, ...newComponent];
      return { ...template, components };
    });
  };

  return (
    <>
      {components ? (
        <Box className={`component ${open ? 'visible_component h-full' : 'hidden_component h-0'}`}>
          {components?.map((component, index) => (
            <ComponentItem key={index} component={component} setTemplateBuilder={setTemplateBuilder} index={index} />
          ))}
          <Box display='flex' justifyContent='end'>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAnotherComponent}>
              {components.length > 0 ? 'Add another component' : 'Add a Component'}
            </Button>
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default ComponentsBuilder;
