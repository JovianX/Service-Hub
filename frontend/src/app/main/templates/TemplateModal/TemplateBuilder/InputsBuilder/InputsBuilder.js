import AddIcon from '@mui/icons-material/Add';
import { Button, Divider, List, ListItemButton, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

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

  const handleShowInput = (index) => {
    setIndex(index);
    setSelectedIndex(index);
  };

  const handleDeleteInput = async (index) => {
    await setSelectedIndex(0);
    await setIndex(0);
    await setTemplateBuilder((template) => {
      let { inputs } = template;
      inputs = [...inputs.filter((item, i) => i !== index)];
      return { ...template, inputs };
    });
  };

  const handleAddAnotherInput = () => {
    setTemplateBuilder((template) => {
      let { inputs } = template;
      inputs = [...inputs, ...newInputs];
      return { ...template, inputs };
    });
  };

  return (
    <>
      {inputs?.length ? (
        <Box display='flex' justifyContent='space-between'>
          <List className='w-2/5 pt-0 h-[70vh] overflow-y-scroll mr-12'>
            {inputs?.map((input, index) => (
              <React.Fragment key={index}>
                <ListItemButton
                  className='group hover:cursor-pointer min-h-[50px]'
                  style={{ borderLeft: selectedIndex === index ? '3px solid #2A3BAB' : '' }}
                  selected={selectedIndex === index}
                  onClick={() => handleShowInput(index)}
                >
                  <ListItemText>
                    {input.name ? input.name : 'name'} - {input.type ? input.type : 'type'}
                  </ListItemText>

                  <Button
                    className='hidden group-hover:flex'
                    variant='text'
                    color='error'
                    size='small'
                    onClick={() => handleDeleteInput(index)}
                  >
                    <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                  </Button>
                </ListItemButton>
                <Divider variant='fullWidth' component='li' />
              </React.Fragment>
            ))}

            <Button
              className='mt-12'
              color='primary'
              variant='contained'
              startIcon={<AddIcon />}
              onClick={handleAddAnotherInput}
            >
              New input
            </Button>
          </List>

          <Box className='w-3/5'>
            <InputItem input={input} index={index} />
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
