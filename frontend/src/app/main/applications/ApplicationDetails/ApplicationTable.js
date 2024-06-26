import AutoDeleteOutlinedIcon from '@mui/icons-material/AutoDeleteOutlined';
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
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from 'react';

import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { getColorForStatus, getPresent, getPresentFromIOSFormat } from '../../../uitls';
import ApplicationTtl from '../ApplicationTtl';
import ApplicationDeleteModal from '../DeleteApplicationModal';

const ApplicationTable = ({ application }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState();
  const [openTtlModal, setOpenTtlModal] = useState(false);
  const [parameters, setParameters] = useState({});

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
                <TableCell>TTL</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>

            {application?.id ? (
              <TableBody>
                <TableRow key={application.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align='left'>{application.name}</TableCell>
                  <TableCell align='left'>
                    <Stack className='max-w-max mx-auto'>
                      <Chip
                        className='capitalize px-20'
                        label={application.status}
                        color={getColorForStatus(application.status)}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell align='left'>
                    {application.template.name}
                    <span className='ml-4'> [Rev {application.template.revision}]</span>
                  </TableCell>
                  <TableCell align='left'>
                    {typeof application.ttl === 'string'
                      ? getPresentFromIOSFormat(application.ttl)
                      : getPresent(application.ttl)}
                  </TableCell>
                  <TableCell align='left'>{application.creator.email}</TableCell>
                  <TableCell align='left'>
                    {typeof application.created_at === 'string'
                      ? getPresentFromIOSFormat(application.created_at)
                      : getPresent(application.created_at)}
                  </TableCell>
                  <TableCell align='right'>
                    <ButtonGroup aria-label='primary button group'>
                      <Button
                        variant='text'
                        color='error'
                        onClick={() => {
                          setParameters({
                            currentDate: application.ttl,
                            id: application.id,
                          });
                          setOpenTtlModal(true);
                        }}
                      >
                        <AutoDeleteOutlinedIcon />
                      </Button>
                      <Button
                        onClick={() => {
                          setOpenDeleteModal(true);
                        }}
                        variant='text'
                        color='error'
                      >
                        <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              ''
            )}
          </Table>
        </TableContainer>
        <ApplicationTtl parameters={parameters} openTtlModal={openTtlModal} setOpenTtlModal={setOpenTtlModal} />
      </FuseScrollbars>
      {openDeleteModal ? (
        <ApplicationDeleteModal
          options={{
            id: application.id,
            isOpenModal: true,
            is_application_page: true,
            title: `Delete application ${application.name}`,
            text: 'Are you sure you want to proceed? This action cannot be undone.',
            confirmText: 'Delete',
          }}
          setOpenDeleteModal={setOpenDeleteModal}
        />
      ) : null}
    </Paper>
  );
};

export default ApplicationTable;
