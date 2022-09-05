import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
  sendInvitation,
  deleteInvitation,
  addInvitation,
  getInvitationsList,
  selectIsInvitationsLoading,
  selectInvitation,
  selectInfoMessage,
} from 'app/store/invitationsSlice';

import UserDialogModal from './UserDialogModal';

const dateFormat = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
};

const InvitationsTable = () => {
  const emailInputRef = useRef();
  const dispatch = useDispatch();
  const invitationsData = useSelector(selectInvitation);
  const infoMessage = useSelector(selectInfoMessage);
  const isLoading = useSelector(selectIsInvitationsLoading);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteUser = (id) => {
    dispatch(deleteInvitation(id));
  };
  const handleInvite = (id) => {
    dispatch(sendInvitation(id));
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const user = { email: e.target.email.value, expiration_period: +e.target.expiration_period.value };
    dispatch(addInvitation({ user }));
  };

  useEffect(() => {
    dispatch(getInvitationsList());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className='w-full flex justify-center'>
        <FuseLoading />
      </div>
    );
  }

  return (
    <>
      <div className='min-h-[70px] m-12 flex justify-between items-center'>
        {infoMessage?.status === 'success' ? (
          <div className='py-[20px] ml-[20px] text-l text-green-400'>{infoMessage?.text}</div>
        ) : (
          <div className='py-[20px] ml-[20px] text-l text-red-400'>{infoMessage?.text}</div>
        )}
        <form onSubmit={handleSubmitCreate} className='flex justify-center items-center'>
          <TextField
            inputRef={emailInputRef}
            name='email'
            type='email'
            required
            id='outlined-required'
            label='Email'
            size='small'
          />
          <TextField
            className='ml-12'
            name='expiration_period'
            type='number'
            required
            id='outlined-required'
            label='Expires after'
            size='small'
            sx={{ width: 130 }}
            InputProps={{
              endAdornment: <InputAdornment position='end'>hours</InputAdornment>,
            }}
            defaultValue={48}
          />
          <Button type='submit' className='ml-12' variant='contained' color='primary' startIcon={<AddIcon />}>
            Invite
          </Button>
        </form>
      </div>

      <div className='w-full flex flex-col'>
        {invitationsData.length ? (
          <Typography variant='h4' component='h4' className='mx-12'>
            Invites
          </Typography>
        ) : (
          ''
        )}
        <Paper className='h-full mx-12 rounded mt-12'>
          <FuseScrollbars className='grow overflow-x-auto'>
            {invitationsData.length ? (
              <TableContainer>
                <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Expiration</TableCell>
                      <TableCell align='center' className='w-1/5'>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {invitationsData.map(
                      (row) =>
                        row.status === 'pending' && (
                          <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell align='left'>{row.email}</TableCell>
                            <TableCell align='left'>{row.status}</TableCell>
                            <TableCell align='left'>
                              {new Date(+row.created_at * 1000)
                                .toLocaleString('en-us', dateFormat)
                                .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')}
                            </TableCell>
                            <TableCell align='left'>
                              {new Date(+row.created_at * 1000 + +row.expiration_period * 3600000)
                                .toLocaleString('en-us', dateFormat)
                                .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')}
                            </TableCell>
                            <TableCell align='right'>
                              <div className='flex justify-end'>
                                <div className='text-left w-[90px]'>
                                  <Button
                                    className='ml-5'
                                    onClick={() => handleInvite(row.id)}
                                    variant='text'
                                    color='success'
                                  >
                                    Resend
                                  </Button>
                                </div>
                                <Button
                                  onClick={() => setOpenDeleteModal(!openDeleteModal)}
                                  variant='text'
                                  color='error'
                                >
                                  <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                                  {openDeleteModal && (
                                    <UserDialogModal
                                      options={{
                                        id: row.id,
                                        isOpenModal: true,
                                        title: 'Delete user',
                                        confirmText: 'Delete',
                                        action: handleDeleteUser,
                                      }}
                                    />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ),
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box className='text-center pb-[20px]'>
                <Typography className='mb-[12px] text-3xl' component='h4'>
                  No users yet
                </Typography>
                <p className='mb-[16px] text-xl'>The list of users is empty. To add a user, fill out the form above</p>
                <Button
                  className='ml-5 px-[28px]'
                  variant='contained'
                  color='primary'
                  onClick={() => emailInputRef.current?.focus()}
                  startIcon={<AddIcon />}
                >
                  Add user
                </Button>
              </Box>
            )}
          </FuseScrollbars>
        </Paper>
      </div>
    </>
  );
};

export default InvitationsTable;
