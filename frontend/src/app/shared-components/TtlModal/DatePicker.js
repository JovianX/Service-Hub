import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const DatePicker = ({ currentDate, getSelectedDate }) => {
  let currentDateInFormat = new Date();
  if (currentDate) {
    currentDateInFormat = new Date(currentDate * 1000);
  }

  const [date, setDate] = useState(dayjs(currentDateInFormat));

  const handleChange = (newValue) => {
    setDate(newValue);
  };

  useEffect(() => {
    getSelectedDate(date);
  }, [date]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='custom-date-picker'>
        <DateTimePicker
          label='ttl'
          renderInput={(params) => <TextField {...params} />}
          value={date}
          onChange={handleChange}
          minDate={dayjs(new Date())}
        />
      </div>
    </LocalizationProvider>
  );
};

export default DatePicker;
