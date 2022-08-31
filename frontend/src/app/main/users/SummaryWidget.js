import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

import _ from '@lodash';

const Spinner = () => (
  <Box id='spinner'>
    <div className='bounce1' />
    <div className='bounce2' />
    <div className='bounce3' />
  </Box>
);

const SummaryWidget = ({ dataKey, dataValue, textColor = 'text-blue-500' }) => {
  return (
    <Paper className='flex flex-col flex-auto shadow rounded-2xl overflow-hidden h-full  min-h-[150px]'>
      <div className='text-center py-10 items-center flex flex-col h-full spinner-container justify-center'>
        {_.isNull(dataValue) ? (
          <Spinner />
        ) : (
          <>
            <div className='flex justify-start items-center w-full'>
              <Typography
                className='px-16 text-md font-medium tracking-tight leading-6 truncate'
                color='text.secondary'
              >
                {dataKey}
              </Typography>
            </div>

            <Typography
              className={`text-7xl sm:text-8xl text-center font-bold tracking-tight leading-none ${textColor}`}
            >
              {dataValue}
            </Typography>
            <Typography className={`text-lg font-medium ${textColor}`}>{dataKey}</Typography>
          </>
        )}
      </div>
    </Paper>
  );
};

export default memo(SummaryWidget);
