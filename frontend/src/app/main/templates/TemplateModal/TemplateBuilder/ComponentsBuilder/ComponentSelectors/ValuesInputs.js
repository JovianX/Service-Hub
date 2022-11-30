import TextField from '@mui/material/TextField';

const ValuesInputs = ({ index, valuesValue, handleOnChangeComponent }) => {
  const handleOnChangeInput = (e) => {
    handleOnChangeComponent(e.target.value, index, 'values');
  };

  return (
    <>
      {valuesValue.map((item) => (
        <div key={Object.keys(item)}>
          <TextField
            size='small'
            type='text'
            fullWidth
            defaultValue={item[Object.keys(item)]}
            required
            className='mr-10'
            label='Key'
            onChange={() => handleOnChangeInput()}
          />
          <TextField
            size='small'
            type='text'
            fullWidth
            defaultValue={item[Object.keys(item)][Object.keys(item)]}
            required
            className='mr-10'
            label='Value'
            onChange={() => handleOnChangeInput()}
          />
        </div>
      ))}
    </>
  );
};

export default ValuesInputs;
