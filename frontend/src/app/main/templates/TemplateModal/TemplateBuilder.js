import { Button, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const TemplateBuilder = ({ open, setOpen, setComponents }) => {
  const [openInputs, setOpenInputs] = useState(false);
  const inputRefName = useRef();
  const inputRefType = useRef();
  const inputRefChart = useRef();
  const inputRefVersion = useRef();

  useEffect(() => {
    if (open) {
      setOpenInputs(true);
      setOpen(false);
    }
  }, [open]);

  const handleAddComponent = (e) => {
    setComponents((components) => {
      const newComponent = {
        components: {
          name: inputRefName.current.value,
          type: inputRefType.current.value,
          chart: inputRefChart.current.value,
          version: inputRefVersion.current.value,
        },
      };
      return [...components, newComponent];
    });
    setOpenInputs(false);
  };

  return (
    <>
      {openInputs && (
        <>
          <TextField inputRef={inputRefName} name='name' type='text' label='Name' margin='normal' fullWidth />
          <TextField inputRef={inputRefType} name='type' type='text' label='Type' margin='normal' fullWidth />
          <TextField inputRef={inputRefChart} name='chart' type='text' label='Chart' margin='normal' fullWidth />
          <TextField inputRef={inputRefVersion} name='version' type='text' label='Version' margin='normal' fullWidth />
          <Button onClick={handleAddComponent}>Add a Component</Button>
        </>
      )}
    </>
  );
};

export default TemplateBuilder;
