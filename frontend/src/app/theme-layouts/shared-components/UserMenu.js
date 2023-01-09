import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { useGetMe } from '../../hooks/useGetMe';

function UserMenu() {
  const user = useGetMe();

  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  return (
    <>
      <Button className='min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6' onClick={userMenuClick} color='inherit'>
        <div className='hidden md:flex flex-col mx-4 items-end'>
          <Typography component='span' className='font-semibold flex'>
            {user?.email || ''}
          </Typography>
          {/* <Typography className='text-11 font-medium capitalize' color='text.secondary'> */}
          {/*  User Role */}
          {/* </Typography> */}
        </div>

        <Avatar src='assets/images/avatars/user-default.png' className='md:mx-4'>
          User Name
        </Avatar>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{ paper: 'py-8' }}
      >
        <>
          <MenuItem
            component={NavLink}
            to='/access-tokens'
            onClick={() => {
              userMenuClose();
            }}
          >
            <ListItemIcon className='min-w-40'>
              <TokenOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Access tokens' />
          </MenuItem>
          <MenuItem
            component={NavLink}
            to='/sign-out'
            onClick={() => {
              userMenuClose();
            }}
          >
            <ListItemIcon className='min-w-40'>
              <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary='Sign out' />
          </MenuItem>
        </>
      </Popover>
    </>
  );
}

export default UserMenu;
