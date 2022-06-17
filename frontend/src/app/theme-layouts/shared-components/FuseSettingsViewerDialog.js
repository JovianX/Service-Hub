import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import qs from 'qs';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectFuseCurrentSettings } from 'app/store/fuse/settingsSlice';

function FuseSettingsViewerDialog(props) {
  const { className } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const settings = useSelector(selectFuseCurrentSettings);

  function handleOpenDialog() {
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  return (
    <div className={clsx('', className)}>
      <Button
        variant='contained'
        color='secondary'
        className='w-full'
        onClick={handleOpenDialog}
        startIcon={<FuseSvgIcon>heroicons-solid:code</FuseSvgIcon>}
      >
        View settings as json/query params
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle className=''>Fuse Settings Viewer</DialogTitle>
        <DialogContent className=''>
          <Typography className='text-16 font-bold mt-24 mb-16'>
            JSON
          </Typography>

          <FuseHighlight component='pre' className='language-json'>
            {JSON.stringify(settings, null, 2)}
          </FuseHighlight>

          <Typography className='text-16 font-bold mt-24 mb-16'>
            Query Params
          </Typography>

          {qs.stringify({
            defaultSettings: JSON.stringify(settings, {
              strictNullHandling: true,
            }),
          })}
        </DialogContent>
        <DialogActions>
          <Button color='secondary' variant='contained'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FuseSettingsViewerDialog;
