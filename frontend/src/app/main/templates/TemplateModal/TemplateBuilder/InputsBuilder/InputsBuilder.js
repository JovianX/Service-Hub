import { Button, Divider, List, ListItemButton, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { TemplateContext } from '../../../TemplateProvider';

import InputItem from './InputItem';

const newInputs = [
  {
    name: '',
    type: '',
  },
];

const InputsBuilder = () => {
  const { templateBuilder, setTemplateBuilder } = useContext(TemplateContext);

  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputs = useMemo(() => {
    if (!templateBuilder?.inputs) {
      return null;
    }
    return templateBuilder.inputs;
  }, [templateBuilder]);

  const input = useMemo(() => {
    if (!inputs) {
      return null;
    }
    return inputs[index];
  }, [inputs, index]);

  useEffect(() => {
    if (!inputs) {
      setTemplateBuilder((template) => ({ ...template, inputs: newInputs }));
    }
  }, [inputs]);

  const handleAddAnotherInput = () => {
    setTemplateBuilder((template) => {
      let { inputs } = template;
      inputs = [...inputs, ...newInputs];
      return { ...template, inputs };
    });
  };

  const handleShowInput = (index) => {
    setIndex(index);
    setSelectedIndex(index);
  };

  return (
    <>
      {inputs?.length ? (
        <Box display='flex' justifyContent='space-between'>
          <List className='w-2/5 pt-0 h-[70vh] overflow-y-scroll mr-12'>
            {inputs?.map((input, index) => (
              <React.Fragment key={index}>
                <ListItemButton
                  className='hover:cursor-pointer'
                  style={{ borderLeft: selectedIndex === index ? '3px solid #2A3BAB' : '' }}
                  selected={selectedIndex === index}
                  onClick={() => handleShowInput(index)}
                >
                  <ListItemText>
                    {input?.name ? input?.name : 'name'} - {input?.type ? input?.type : 'type'}
                  </ListItemText>
                </ListItemButton>
                <Divider variant='fullWidth' component='li' />
              </React.Fragment>
            ))}
            <Box>
              <Button onClick={handleAddAnotherInput}>Add another input</Button>
            </Box>
          </List>

          <Box className='w-3/5'>
            <InputItem input={input} index={index} setSelectedIndex={setSelectedIndex} setIndex={setIndex} />
          </Box>
        </Box>
      ) : (
        <Box>
          <Button onClick={handleAddAnotherInput}>Add an input</Button>
        </Box>
      )}
    </>
  );
};

export default InputsBuilder;
