import { yupResolver } from '@hookform/resolvers/yup';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import _ from '@lodash';
import { getInvitedUserEmail } from 'app/store/invitationsSlice';

import history from '../../../@history/@history';
import jwtService from '../../auth/services/jwtService';

const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

function SignUpPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const inviteId = searchParams.get('invite_id');
  const [invitedEmail, setInvitedEmail] = useState('');

  const defaultValues = {
    email: invitedEmail,
    password: '',
    passwordConfirm: '',
  };

  const { control, formState, handleSubmit, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (inviteId) {
      const fetchData = async () => {
        const data = await dispatch(getInvitedUserEmail(inviteId));
        setInvitedEmail(data.payload);
      };
      fetchData();
    }
  }, [dispatch]);

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async ({ password, email }) => {
    try {
      await jwtService.createUser({
        password,
        email,
      });

      await jwtService.signInWithEmailAndPassword(email, password);

      history.push('/');
    } catch (errors) {
      setError('email', {
        type: 'manual',
        message: errors?.response?.data?.detail,
      });
    }
  };

  const onGithubSignUp = async () => {
    try {
      const url = await jwtService.signInWithGithub();
      if (inviteId) {
        localStorage.setItem('inviteId', inviteId);
      }
      history.push(url);
    } catch (errors) {
      setError('email', {
        type: 'manual',
        message: 'Failed to sign in with GitHub',
      });
    }
  };

  return (
    <div className='flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0'>
      <Paper className='h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1'>
        <div className='w-full max-w-320 sm:w-320 mx-auto sm:mx-0'>
          <img className='w-[100px]' src='assets/images/logo.png' alt='logo' />

          <Typography className='mt-32 text-4xl font-extrabold tracking-tight leading-tight'>Sign up</Typography>
          <div className='flex items-baseline mt-2 font-medium'>
            <Typography>Already have an account?</Typography>
            <Link className='ml-4' to='/sign-in'>
              Sign in
            </Link>
          </div>

          <form
            name='registerForm'
            noValidate
            className='flex flex-col justify-center w-full mt-32'
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className='mb-24'
                  label='Email'
                  type='email'
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant='outlined'
                  required
                  fullWidth
                  value={invitedEmail}
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className='mb-24'
                  label='Password'
                  type='password'
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant='outlined'
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name='passwordConfirm'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className='mb-24'
                  label='Password (Confirm)'
                  type='password'
                  error={!!errors.passwordConfirm}
                  helperText={errors?.passwordConfirm?.message}
                  variant='outlined'
                  required
                  fullWidth
                />
              )}
            />

            <Button
              variant='contained'
              color='secondary'
              className='w-full mt-24'
              aria-label='Register'
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type='submit'
              size='large'
            >
              Create account
            </Button>
          </form>
          <div className='flex items-center mt-32'>
            <div className='flex-auto mt-px border-t' />
            <Typography className='mx-8' color='text.secondary'>
              Or create account with
            </Typography>
            <div className='flex-auto mt-px border-t' />
          </div>
          <div className='flex items-center mt-32 space-x-16'>
            <Button variant='outlined' className='flex-auto' onClick={onGithubSignUp}>
              <FuseSvgIcon size={20} color='action'>
                feather:github
              </FuseSvgIcon>
            </Button>
          </div>
        </div>
      </Paper>

      <Box
        className='relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden'
        sx={{ backgroundColor: 'primary.main' }}
      >
        <svg
          className='absolute inset-0 pointer-events-none'
          viewBox='0 0 960 540'
          width='100%'
          height='100%'
          preserveAspectRatio='xMidYMax slice'
          xmlns='http://www.w3.org/2000/svg'
        >
          <Box
            component='g'
            sx={{ color: 'primary.light' }}
            className='opacity-20'
            fill='none'
            stroke='currentColor'
            strokeWidth='100'
          >
            <circle r='234' cx='196' cy='23' />
            <circle r='234' cx='790' cy='491' />
          </Box>
        </svg>
        <Box
          component='svg'
          className='absolute -top-64 -right-64 opacity-20'
          sx={{ color: 'primary.light' }}
          viewBox='0 0 220 192'
          width='220px'
          height='192px'
          fill='none'
        >
          <defs>
            <pattern
              id='837c3e70-6c3a-44e6-8854-cc48c737b659'
              x='0'
              y='0'
              width='20'
              height='20'
              patternUnits='userSpaceOnUse'
            >
              <rect x='0' y='0' width='4' height='4' fill='currentColor' />
            </pattern>
          </defs>
          <rect width='220' height='192' fill='url(#837c3e70-6c3a-44e6-8854-cc48c737b659)' />
        </Box>

        <div className='z-10 relative w-full max-w-2xl'>
          <div className='text-7xl font-bold leading-none text-gray-100'>
            <img src='assets/images/logo-white.png' width='130px' />
            <div>Service Hub</div>
          </div>
          <div className='mt-24 text-lg tracking-tight leading-6 text-gray-400'>
            Create on-demand services with Helm and Kubernetes.
          </div>
          <div className='flex items-center mt-32'>
            <AvatarGroup sx={{ '& .MuiAvatar-root': { borderColor: 'primary.main' } }}>
              <Avatar src='assets/images/avatars/male-09.jpg' />
              <Avatar src='assets/images/avatars/female-18.jpg' />
              <Avatar src='assets/images/avatars/female-11.jpg' />
              <Avatar src='assets/images/avatars/male-16.jpg' />
            </AvatarGroup>

            <div className='ml-16 font-medium tracking-tight text-gray-400'>
              More than 1k DevOps engineers are using Service Hub, now it's your turn.
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SignUpPage;
