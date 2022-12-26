import { Chip, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import FuseLoading from '@fuse/core/FuseLoading';

import { getApplicationEventsList as getApplicationEventsListAPI } from '../../../../../api/events';
import { CATEGORIES_OF_EVENTS } from '../../../../../constants/categoriesOfEvents';
import { getColorForStatus, getPresentFromIOSFormat } from '../../../../../uitls';

const ApplicationEvents = () => {
  const { id } = useParams();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      await getApplicationEventsListAPI(CATEGORIES_OF_EVENTS.APPLICATION, id).then((events) => {
        setEvents(events.data);
      });
    })();
  }, []);

  if (events.length === 0) {
    return (
      <div className='w-full flex flex-col min-h-full'>
        <FuseLoading />
      </div>
    );
  }

  return (
    <Box className='w-full'>
      <Paper className='w-full'>
        <TableContainer>
          <Table stickyHeader className='min-w-xl'>
            <TableHead>
              <TableRow>
                <TableCell>Created</TableCell>
                <TableCell align='center'>Severity</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events?.length > 0 &&
                events.map((event, index) => (
                  <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align='left'>{getPresentFromIOSFormat(event.created_at)}</TableCell>
                    <TableCell align='left'>
                      <Stack>
                        <Chip className='capitalize' label={event.severity} color={getColorForStatus(event.severity)} />
                      </Stack>
                    </TableCell>
                    <TableCell align='left'>{event.title}</TableCell>
                    <TableCell align='left'>{event.message}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ApplicationEvents;
