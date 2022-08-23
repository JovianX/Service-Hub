import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendInvite } from '../../api/invitations';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import { getInvitesList, selectIsInvitesLoading, selectInvites } from 'app/store/invitesSlice';
import { Controller, useForm } from 'react-hook-form';

import { Button, TextField } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const InvitesTable = () => {

  const [invites, setInvites] = useState([]);

  const dispatch = useDispatch();
  const invitesData = useSelector(selectInvites);
  const isLoading = useSelector(selectIsInvitesLoading);

  useEffect(() => {
    setInvites(invitesData);
  }, [invitesData]);

  useEffect(() => {
    dispatch(getInvitesList());
  }, [dispatch]);

  
  const sendData = (email) => {
    console.log('click')
    sendInvite(email);
  }

  if (isLoading) {
    return (
      <div className='w-full flex flex-col min-h-full'>
        <FuseLoading />
      </div>
    );
  }

  const defaultValues = {
    email: ''
  };
  const schema = yup.object().shape({
    email: yup.string().email('You must enter a valid email').required('You must enter a email')
  });
  
  const AddEmailForm = () => {
    const { control, formState, handleSubmit, setError } = useForm({
      mode: 'onChange',
      defaultValues,
      resolver: yupResolver(schema),
    });

    const { isValid, dirtyFields, errors } = formState;

    const onSubmit = async ({ email }) => {
      try {
        const response = await sendData(email)
        if (response) {
          // TODO:add next steps
        }
      } catch (errors) {
        setError('email', {
          type: 'manual',
          message: errors?.response?.data?.detail,
        });
      }
    };

    return (
      <div className='m-12'>
        <form
          name='sendInviteForm'
          noValidate
          className='flex flex-row justify-start items-baseline gap-x-12'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='Email'
                type='email'
                error={!!errors.email}
                helperText={errors?.email?.message}
                variant='outlined'
                required
              />
            )}
          />

          <Button
            variant='outlined'
            color='secondary'
            aria-label='Send-invite'
            disabled={_.isEmpty(dirtyFields) || !isValid}
            type='submit'
            size='large'
          >
            Send invite
          </Button>
        </form>
      </div>
    )
  }
  return (
    <div className='w-full flex flex-col min-h-full'>
      <Paper className='h-full mx-0 rounded'>
      <AddEmailForm />
        <FuseScrollbars className='grow overflow-x-auto'>
          <TableContainer>
            <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
              <TableHead>
                <TableRow>
                  <TableCell>email address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Expiration</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {invites?.map((row) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align='left'>{row?.creator?.email}</TableCell>
                    <TableCell align='left'>{row.status}</TableCell>
                    <TableCell align='left'>{row.created_at}</TableCell>
                    <TableCell align='left'>{row.expiration_period}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FuseScrollbars>
      </Paper>
    </div>
  );
};

export default InvitesTable;
