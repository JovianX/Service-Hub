import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const ReleasesDatePicker = ({ currentDate, getSelectedDate }) => {
  let currentDateInFormat = new Date();
  if (currentDate) {
    currentDateInFormat = new Date(currentDate * 1000);
  }

  const [value, setValue] = useState(dayjs(currentDateInFormat));

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getSelectedDate(value);
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='customDatePickerWidth'>
        <DateTimePicker
          label='ttl'
          renderInput={(params) => <TextField {...params} />}
          value={value}
          onChange={handleChange}
          minDate={dayjs(new Date())}
        />
      </div>
    </LocalizationProvider>
  );
};

export default ReleasesDatePicker;
