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
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { getApplicationOutputs as getApplicationOutputsAPI } from '../../../api';
import { getColorForStatus } from '../../../uitls';
import ApplicationDeleteModal from '../DeleteApplicationModal';
import OutputTooltip from '../OutputTooltip';

const ApplicationTable = ({ application, applicationOutput }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState();
  const [output, setOutput] = useState(applicationOutput);

  useEffect(() => {
    if (!applicationOutput) {
      (async () => {
        console.log(1);
        await getApplicationOutputsAPI(application.id).then(({ data }) => setOutput(data.notes));
      })();
    }
  }, [applicationOutput, application]);

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
                <TableCell>Output</TableCell>
                <TableCell>Created By</TableCell>
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
                  <TableCell align='left'>{application.template.name}</TableCell>
                  <TableCell align='left'>{application.template.revision}</TableCell>
                  <TableCell lign='left'>
                    {output ? (
                      <Box display='flex' alignItems='center'>
                        <Box className='w-[50px] mr-20'>{output.substring(0, 12).concat('...')}</Box>
                        <OutputTooltip output={output} />
                      </Box>
                    ) : null}
                  </TableCell>

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
