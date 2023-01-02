import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import DatePicker from 'app/shared-components/TtlModal/DatePicker';

const TtlModal = ({
  open,
  handleSet,
  handleUnset,
  handleClose,
  currentDate,
  getSelectedDate,
  loading,
  infoMessageSuccess,
  infoMessageError,
  disabled,
}) => {
  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle className='bg-primary text-center text-white mb-24'>Set TTL</DialogTitle>
        <DialogContent>
          <div>
            <div className='mb-24'>Set scheduled deletion of the helm release:</div>
          </div>
          <div>
            <DatePicker currentDate={currentDate} getSelectedDate={getSelectedDate} />
          </div>
        </DialogContent>
        <DialogActions className='p-24 pt-4 justify-between'>
          <div className='flex items-center'>
            <Button disabled={disabled} color='error' variant='contained' className='mr-14' onClick={handleUnset}>
              Unset TTL
            </Button>
            <div>
              <div>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>
              <div>{infoMessageSuccess && <p className='text-green'>{infoMessageSuccess}</p>}</div>
            </div>
          </div>

          <div>
            <Button className='mr-14' onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              color='primary'
              onClick={handleSet}
              loading={loading}
              loadingPosition='start'
              startIcon={<SaveIcon />}
              variant='contained'
            >
              Save
            </LoadingButton>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default TtlModal;
