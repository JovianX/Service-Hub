import { Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';

const SnackbarMessage = ({ status, message, showMessage, setShowMessage }) => {
  const handleClose = () => {
    setShowMessage(false);
  };

  return (
    <Snackbar open={showMessage} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={status === 'error' ? 'error' : 'success'} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarMessage;
