import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState } from 'react';

import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { getColorForStatus } from '../../../uitls';
import ApplicationDeleteModal from '../ApplicationDeleteModal';

const ApplicationTable = ({ application }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState();

  return (
    <Paper className='h-100 rounded mt-12'>
      <FuseScrollbars className='grow overflow-x-auto'>
        <TableContainer>
          <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align='center'>Status</TableCell>
                <TableCell>Template</TableCell>
                <TableCell>Reversion</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>

            {application?.id ? (
              <TableBody>
                <TableRow key={application.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align='left'>{application.name}</TableCell>
                  <TableCell align='left'>
                    <Stack>
                      <Chip
                        className='capitalize'
                        label={application.status}
                        color={getColorForStatus(application.status)}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell align='left'>{application.template.name}</TableCell>
                  <TableCell align='left'>{application.template.revision}</TableCell>
                  <TableCell align='left'>{application.creator.email}</TableCell>
                  <TableCell align='right'>
                    <Button
                      onClick={() => {
                        setOpenDeleteModal(true);
                      }}
                      variant='text'
                      color='error'
                    >
                      <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              ''
            )}
          </Table>
        </TableContainer>
      </FuseScrollbars>
      {openDeleteModal ? (
        <ApplicationDeleteModal
          options={{
            id: application.id,
            isOpenModal: true,
            is_application_page: true,
            title: `Delete application ${application.name}?`,
            text: 'Are you sure you want to proceed',
            confirmText: 'Delete',
          }}
          setOpenDeleteModal={setOpenDeleteModal}
        />
      ) : null}
    </Paper>
  );
};

export default ApplicationTable;
