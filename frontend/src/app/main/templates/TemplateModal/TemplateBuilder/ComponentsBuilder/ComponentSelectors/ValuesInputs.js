import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';

const ValuesInputs = ({ value, index, nestedIndex, handleOnChangeComponent, handleDeleteComponentValues }) => {
  return (
    <>
      {!Array.isArray(value) ? (
        <>
          <TextField
            size='small'
            type='text'
            fullWidth
            value={Object.keys(value) || ''}
            className='mr-10'
            label='Key'
            onChange={(e) => handleOnChangeComponent(e.target.value, index, 'values', nestedIndex, 'key')}
          />
          <TextField
            size='small'
            type='text'
            fullWidth
            value={value[Object.keys(value)]}
            className='mr-10'
            label='Value'
            onChange={(e) => handleOnChangeComponent(e.target.value, index, 'values', nestedIndex, 'value')}
          />
          <Box display='flex' justifyContent='end' className='col-span-2 mt-[-10px]'>
            <Button onClick={() => handleDeleteComponentValues(index, nestedIndex)}>Delete value</Button>
          </Box>
        </>
      ) : (
        <>
          <TextField disabled size='small' type='text' fullWidth value={value[0]} className='mr-10' label='Key' />
          <TextField
            disabled
            size='small'
            type='text'
            fullWidth
            value={value[value.length - 1] || ''}
            className='mr-10'
            label='Value'
          />
          <Box display='flex' justifyContent='end' className='col-span-2 mt-[-10px]'>
            <Button onClick={() => handleDeleteComponentValues(index, nestedIndex)}>Delete value</Button>
          </Box>
        </>
      )}
    </>
  );
};

export default ValuesInputs;
