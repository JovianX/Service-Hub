import AddIcon from '@mui/icons-material/Add';
import { Button, Divider, List, ListItemButton, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import yaml from 'js-yaml';
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

const InputsBuilder = ({ inputs }) => {
  const { setTemplateBuilder, infoIsYamlValid } = useContext(TemplateContext);

  const [index, setIndex] = useState(0);
  const [actionType, setActionType] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const input = useMemo(() => {
    if (!inputs) {
      return null;
    }
    return inputs[index];
  }, [inputs, index]);

  useEffect(() => {
    if (actionType === 'ADD') {
      setIndex(inputs.length - 1);
      setSelectedIndex(inputs.length - 1);
    }
  }, [inputs]);

  const handleShowInput = (index) => {
    setActionType('');
    setIndex(index);
    setSelectedIndex(index);
  };

  const handleDeleteInput = async (index) => {
    await setActionType('');
    await setSelectedIndex(0);
    await setIndex(0);

    await setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      let { inputs } = template;
      inputs = [...inputs.filter((item, i) => i !== index)];
      return yaml.dump({ ...template, inputs });
    });
  };

  const handleAddAnotherInput = () => {
    setActionType('ADD');
    setTemplateBuilder((configYamlText) => {
      const template = yaml.load(configYamlText, { json: true });
      let inputs;
      if (template?.inputs) {
        inputs = template.inputs;
      } else {
        inputs = [];
      }
      inputs = [...inputs, ...newInputs];
      return yaml.dump({ ...template, inputs });
    });
  };

  return (
    <>
      {inputs?.length ? (
        <Box display='flex' justifyContent='space-between'>
          <List className='w-2/5 pt-0 h-full overflow-y-scroll mr-12'>
            {inputs?.map((input, index) => (
              <React.Fragment key={index}>
                <ListItemButton
                  className='group hover:cursor-pointer min-h-[50px]'
                  style={{ borderLeft: selectedIndex === index ? '3px solid #2A3BAB' : '' }}
                  selected={selectedIndex === index}
                  onClick={() => handleShowInput(index)}
                >
                  <ListItemText>
                    {input?.name ? input?.name : 'name'} - {input?.type ? input?.type : 'type'}
                  </ListItemText>

                  <Button
                    disabled={!!infoIsYamlValid}
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
              disabled={!!infoIsYamlValid}
              className='mt-12'
              color='primary'
              variant='contained'
              startIcon={<AddIcon />}
              onClick={handleAddAnotherInput}
            >
              New input
            </Button>
          </List>

          {input ? (
            <Box className='w-3/5'>
              <InputItem input={input} index={index} infoIsYamlValid={infoIsYamlValid} />
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
            onClick={handleAddAnotherInput}
          >
            New input
          </Button>
        </Box>
      )}
    </>
  );
};

export default InputsBuilder;
