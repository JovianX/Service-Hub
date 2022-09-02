import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DialogModal from 'app/shared-components/DialogModal';
import {
  sendInvite,
  deleteUser,
  addUser,
  getUsersList,
  selectIsUsersLoading,
  selectUsers,
  selectInfoMessage,
} from 'app/store/usersSlice';

const UsersTable = () => {
  const emailInputRef = useRef();
  const dispatch = useDispatch();
  const usersData = useSelector(selectUsers);
  const infoMessage = useSelector(selectInfoMessage);
  const isLoading = useSelector(selectIsUsersLoading);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const toggleDeleteModalOpen = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };
  const handleDeleteCancel = () => {
    toggleDeleteModalOpen();
  };
  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    toggleDeleteModalOpen();
  };
  const handleDeleteUser = () => {
    dispatch(deleteUser(deleteId));
    setIsDeleteModalOpen(false);
  };
  const handleInvite = (id) => {
    dispatch(sendInvite(id));
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const user = { email: e.target.email.value, expiration_period: +e.target.expiration_period.value };
    dispatch(addUser({ user }));
  };

  useEffect(() => {
    dispatch(getUsersList());
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
        <form onSubmit={handleSubmitCreate} className='flex justify-center items-center mr-[16px]'>
          <TextField
            inputRef={emailInputRef}
            name='email'
            type='email'
            required
            id='outlined-required'
            label='email'
            size='small'
          />
          <TextField
            className='ml-12'
            name='expiration_period'
            type='number'
            required
            id='outlined-required'
            label='Hours Valid'
            size='small'
            defaultValue={48}
          />
          <Button type='submit' className='ml-12' variant='contained' color='primary' startIcon={<AddIcon />}>
            Invite
          </Button>
        </form>
      </div>

      <div className='w-full flex flex-col min-h-full'>
        <Paper className='h-full mx-12 rounded mt-12'>
          <FuseScrollbars className='grow overflow-x-auto'>
            {usersData.length ? (
              <TableContainer>
                <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Expiration</TableCell>
                      <TableCell align='center'>Actions</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {usersData.map((row) => (
                      <TableRow key={row.email} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align='left'>{row.email}</TableCell>
                        <TableCell align='left'>{row.status}</TableCell>
                        <TableCell align='left'>{new Date(+row.created_at * 1000).toDateString()}</TableCell>
                        <TableCell align='left'>{row.expiration_period}</TableCell>
                        <TableCell align='right'>
                          <Button onClick={() => handleDeleteConfirm(row.id)} variant='text' color='error'>
                            <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                          </Button>
                          <Button className='ml-5' onClick={() => handleInvite(row.id)} variant='text' color='success'>
                            Resend
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div className='text-center p-[100px]'>
                <h2 className='mb-[12px] text-4xl'>No users yet</h2>
                <p className='mb-[16px] text-2xl'>The list of users is empty. To add a user, fill out the form above</p>
                <Button
                  className='ml-5 text-2xl px-[36px] py-[22px]'
                  variant='contained'
                  color='primary'
                  onClick={() => emailInputRef.current?.focus()}
                  startIcon={<AddIcon />}
                >
                  Add user
                </Button>
              </div>
            )}
          </FuseScrollbars>
        </Paper>
      </div>

      <DialogModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        title='Delete user'
        text='Are you sure you want to proceed?'
        onCancel={handleDeleteCancel}
        cancelText='Cancel'
        onConfirm={handleDeleteUser}
        confirmText='Delete'
        fullWidth
      />
    </>
  );
};

export default UsersTable;
