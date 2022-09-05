import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectIsInvitationsLoading } from 'app/store/invitationsSlice';
import { getUsersList, activateUser, deactivateUser, deleteUser, selectUsers } from 'app/store/usersSlice';

import UserDialogModal from './UserDialogModal';

const InvitationsTable = () => {
  const dispatch = useDispatch();
  const usersData = useSelector(selectUsers);
  const isLoading = useSelector(selectIsInvitationsLoading);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
  const [openActivateModal, setOpenActivateModal] = useState(false);

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
  };
  const handleActivate = (id) => {
    dispatch(activateUser(id));
  };
  const handleDeactivate = (id) => {
    dispatch(deactivateUser(id));
  };

  useEffect(() => {
    dispatch(getUsersList());
  }, [dispatch]);

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <div className='w-full flex flex-col mt-[50px]'>
        {usersData.length ? (
          <Typography variant='h4' component='h4' className='mx-12'>
            Active users
          </Typography>
        ) : (
          ''
        )}
        <Paper className='h-full mx-12 rounded mt-12'>
          <FuseScrollbars className='grow overflow-x-auto'>
            {usersData.length && (
              <TableContainer>
                <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align='center' className='w-1/5'>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usersData.map((row) => (
                      <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align='left'>{row.email}</TableCell>
                        <TableCell align='left'>{row.is_active ? 'Active' : 'Not active'}</TableCell>
                        <TableCell align='right'>
                          <div className='flex justify-end'>
                            <div className='text-left w-[90px]'>
                              {row.is_active ? (
                                <Button
                                  className='ml-5'
                                  onClick={() => setOpenDeactivateModal(!openDeactivateModal)}
                                  variant='text'
                                  color='error'
                                >
                                  Deactivate
                                  {openDeactivateModal && (
                                    <UserDialogModal
                                      options={{
                                        id: row.id,
                                        isOpenModal: true,
                                        title: 'Deactivate user',
                                        confirmText: 'Deactivate',
                                        action: handleDeactivate,
                                      }}
                                    />
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  className='ml-5'
                                  onClick={() => setOpenActivateModal(!openActivateModal)}
                                  variant='text'
                                  color='success'
                                >
                                  Activate
                                  {openActivateModal && (
                                    <UserDialogModal
                                      options={{
                                        id: row.id,
                                        isOpenModal: true,
                                        title: 'Activate user',
                                        confirmText: 'Activate',
                                        action: handleActivate,
                                      }}
                                    />
                                  )}
                                </Button>
                              )}
                            </div>
                            <Button onClick={() => setOpenDeleteModal(!openDeleteModal)} variant='text' color='error'>
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </FuseScrollbars>
        </Paper>
      </div>
    </>
  );
};

export default InvitationsTable;
