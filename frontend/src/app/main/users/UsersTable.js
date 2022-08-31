import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import DialogModal from 'app/shared-components/DialogModal';
import {
  sendInvite,
  deleteUser,
  addUser,
  getUsersList,
  selectIsUsersLoading,
  selectUsers,
  selectCreatedUser,
} from 'app/store/usersSlice';

const UsersTable = () => {
  const dispatch = useDispatch();
  const usersData = useSelector(selectUsers);
  const createdUser = useSelector(selectCreatedUser);
  const isLoading = useSelector(selectIsUsersLoading);

  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const toggleDeleteModalOpen = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };
  const handleDeleteCancel = () => {
    toggleDeleteModalOpen();
    setUserToDelete(null);
  };
  const handleDeleteConfirm = async (id) => {
    setDeleteId(id);
    toggleDeleteModalOpen();
    setUserToDelete(null);
  };
  const handleDeleteUser = async () => {
    await dispatch(deleteUser(deleteId));
    setIsDeleteModalOpen(false);
  };

  const handleInvite = async (id) => {
    await dispatch(sendInvite(id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { email: e.target.email.value, expiration_period: +e.target.expiration_period.value };
    dispatch(addUser({ user }));
  };

  useEffect(() => {
    dispatch(getUsersList());
  }, [dispatch, createdUser]);

  if (isLoading) {
    return (
      <div className='w-full flex justify-center'>
        <FuseLoading />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='m-12 flex justify-end items-center'>
        <TextField name='email' type='email' required id='outlined-required' label='email' />
        <TextField
          className='ml-12'
          name='expiration_period'
          type='number'
          required
          id='outlined-required'
          label='expiration period'
        />
        <Button type='submit' className='ml-12' variant='outlined' color='success'>
          Add
        </Button>
      </form>

      <div className='w-full flex flex-col min-h-full'>
        <Paper className='h-full mx-12 rounded mt-12'>
          <FuseScrollbars className='grow overflow-x-auto'>
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
                  {usersData?.map((row) => (
                    <TableRow key={row.email} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align='left'>{row.email}</TableCell>
                      <TableCell align='left'>{row.status}</TableCell>
                      <TableCell align='left'>{new Date(+row.created_at * 1000).toDateString()}</TableCell>
                      <TableCell align='left'>{row.expiration_period}</TableCell>
                      <TableCell align='center'>
                        <Button onClick={() => handleDeleteConfirm(row.id)} variant='outlined' color='error'>
                          Delete
                        </Button>
                        <Button
                          className='ml-5'
                          onClick={() => handleInvite(row.id)}
                          variant='outlined'
                          color='success'
                        >
                          Send invite
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </FuseScrollbars>
        </Paper>
      </div>

      <DialogModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        title={`Delete user ${userToDelete}`}
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
