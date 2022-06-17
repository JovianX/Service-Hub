import Dialog from '@mui/material/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDialog,
  selectFuseDialogOptions,
  selectFuseDialogState,
} from 'app/store/fuse/dialogSlice';

function FuseDialog(props) {
  const dispatch = useDispatch();
  const state = useSelector(selectFuseDialogState);
  const options = useSelector(selectFuseDialogOptions);

  return (
    <Dialog
      open={state}
      onClose={(ev) => dispatch(closeDialog())}
      aria-labelledby="fuse-dialog-title"
      classes={{
        paper: 'rounded-8',
      }}
      {...options}
    />
  );
}

export default FuseDialog;
