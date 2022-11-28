import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

const ChartSelector = ({ schema, value }) => {
  const [chart, setChart] = useState('');

  useEffect(() => {
    setChart(value);
  }, [value]);

  const handleChangeChart = (e) => {
    const selectedChart = chartData.find((item) => item.application_name === e.target.value);
    if (selectedChart) {
      dispatch(setChartName(selectedChart.name));
    }
    setChart(e.target.value);
    handleChangeInputs();
  };

  return (
    <FormControl size='small' required fullWidth className='mb-10'>
      <InputLabel>Chart</InputLabel>
      <Select
        name='chart'
        value={chart}
        label='Chart'
        MenuProps={{ PaperProps: { sx: { maxHeight: 400 } } }}
        onChange={handleChangeChart}
      >
        {schema.enum?.map((chart) => (
          <MenuItem key={chart} value={chart}>
            {chart}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ChartSelector;
