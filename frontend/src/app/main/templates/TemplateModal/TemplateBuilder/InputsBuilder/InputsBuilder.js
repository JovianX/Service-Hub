import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

const InputsBuilder = ({ isOpenInputs, setIsOpenInputs, inputs, setTemplateBuilder }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isOpenInputs) {
      setOpen(true);
      setIsOpenInputs(false);
    }
  }, [isOpenInputs]);

  return (
    <Box className={`input ${open ? 'visible_input h-full' : 'hidden_input h-0'}`}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Box>
          <div className='grid grid-cols-2 gap-10 mb-24'>
            <div>aaa</div>
            <div>bbb</div>
          </div>
        </Box>
        <div>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => console.log('add an input')}>Add an Input</Button>
        </div>
      </Box>
    </Box>
  );
};

export default InputsBuilder;
