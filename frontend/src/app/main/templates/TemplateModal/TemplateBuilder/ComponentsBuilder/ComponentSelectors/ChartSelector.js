import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectCharts, setChartName } from 'app/store/chartsSlice';

const ChartSelector = ({ chartValue, index, handleOnChangeComponent, infoIsYamlValid }) => {
  const [chart, setChart] = useState('');
  const dispatch = useDispatch();
  const [charts, setCharts] = useState([chartValue]);
  const chartData = useSelector(selectCharts);

  useEffect(() => {
    setChart('');
    if (chartValue) {
      setChart(chartValue);
    }
  }, [chartValue]);

  useEffect(() => {
    if (chartData.length) {
      const chartsName = [];
      chartData.forEach((item) => {
        chartsName.push(item.name);
      });
      setCharts(chartsName);
    }
  }, [chartData]);

  const handleChangeChart = (e) => {
    const selectedChart = chartData.find((item) => item.name === e.target.value);
    if (selectedChart) {
      dispatch(setChartName(selectedChart.name));
    }
    setChart(e.target.value);
    handleOnChangeComponent(e.target.value, index, 'chart');
  };

  return (
    <FormControl size='small' required fullWidth disabled={!!infoIsYamlValid}>
      <InputLabel>Chart</InputLabel>
      <Select
        name='chart'
        value={chart}
        label='Chart'
        onChange={handleChangeChart}
        MenuProps={{ PaperProps: { sx: { maxHeight: 400 } } }}
      >
        {charts?.map((chart, index) => (
          <MenuItem key={index} value={chart}>
            {chart}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ChartSelector;
