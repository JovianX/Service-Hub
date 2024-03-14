import { Button, DialogContentText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const DialogModal = ({
  isOpen,
  onClose,
  title,
  text,
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  fullWidth = false,
}) => {
  return (
    <Dialog
      aria-labelledby={`${title}-title`}
      aria-describedby={`${title}-description`}
      open={isOpen}
      onClose={onClose}
      fullWidth={fullWidth}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color='primary'>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color='error' autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogModal;
