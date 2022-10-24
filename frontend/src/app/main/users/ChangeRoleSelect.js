import { InputLabel, Select } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import SnackbarMessage from 'app/shared-components/Snackbar';
import { changeUserRole } from 'app/store/usersSlice';

const ChangeRoleSelect = ({ user }) => {
  const dispatch = useDispatch();

  const [snackbarInfo, setSnackbarInfo] = useState({
    status: '',
    message: '',
  });
  const [showMessage, setShowMessage] = useState(false);
  const [role, setRole] = useState(user.role);

  const handleChangeRole = async (e, id) => {
    await dispatch(changeUserRole({ user_id: id, role: e.target.value })).then((res) => {
      setShowMessage(true);
      if (res.payload.status === 'error') {
        setSnackbarInfo({ status: res.payload.status, message: res.payload.message });
        setRole(role);
      } else {
        setSnackbarInfo({ status: res.payload.status, message: 'Role changed successfully' });
        setRole((role) => (role === 'admin' ? 'operator' : 'admin'));
      }
    });
  };

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
        <InputLabel>Role</InputLabel>
        <Select value={role} label='Role' onChange={(e) => handleChangeRole(e, user.id)}>
          <MenuItem value='admin'>Admin</MenuItem>
          <MenuItem value='operator'>Operator</MenuItem>
        </Select>
      </FormControl>

      <SnackbarMessage
        status={snackbarInfo?.status}
        message={snackbarInfo?.message}
        showMessage={showMessage}
        setShowMessage={setShowMessage}
      />
    </>
  );
};

export default ChangeRoleSelect;
