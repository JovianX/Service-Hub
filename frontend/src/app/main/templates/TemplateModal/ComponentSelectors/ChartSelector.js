import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectCharts, setChartName } from 'app/store/chartsSlice';

const ChartSelector = ({ chart, setChart, chartValue }) => {
  const dispatch = useDispatch();
  const [charts, setCharts] = useState([]);

  const chartData = useSelector(selectCharts);

  useEffect(() => {
    if (chartData.length && setChart) {
      const chartsName = [];
      chartData.forEach((item) => {
        chartsName.push(item.application_name);
      });
      dispatch(setChartName(chartData[0].name));
      setCharts(chartsName);
      setChart(chartsName[0]);
    }
  }, [chartData]);

  const handleChangeChart = (e) => {
    const selectedChart = chartData.find((item) => item.application_name === e.target.value);
    if (selectedChart) {
      dispatch(setChartName(selectedChart.name));
    }
    setChart(e.target.value);
  };

  return (
    <FormControl size='small' required fullWidth className='mb-10'>
      <InputLabel>Chart</InputLabel>
      <Select
        name='chart'
        value={chartValue || chart}
        label='Chart'
        onChange={handleChangeChart}
        MenuProps={{ PaperProps: { sx: { maxHeight: 400 } } }}
      >
        {!chartValue ? (
          charts?.map((chart) => (
            <MenuItem key={chart} value={chart}>
              {chart}
            </MenuItem>
          ))
        ) : (
          <MenuItem key={chartValue} value={chartValue}>
            {chartValue}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default ChartSelector;
