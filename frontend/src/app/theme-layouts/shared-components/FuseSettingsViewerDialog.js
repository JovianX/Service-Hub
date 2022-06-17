import { useState } from 'react';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Dialog from '@mui/material/Dialog';
import { useSelector } from 'react-redux';
import { selectFuseCurrentSettings } from 'app/store/fuse/settingsSlice';
import FuseHighlight from '@fuse/core/FuseHighlight';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import qs from 'qs';
import Typography from '@mui/material/Typography';

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
        variant="contained"
        color="secondary"
        className="w-full"
        onClick={handleOpenDialog}
        startIcon={<FuseSvgIcon>heroicons-solid:code</FuseSvgIcon>}
      >
        View settings as json/query params
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
        <DialogTitle className="">Fuse Settings Viewer</DialogTitle>
        <DialogContent className="">
          <Typography className="text-16 font-bold mt-24 mb-16">JSON</Typography>

          <FuseHighlight component="pre" className="language-json">
            {JSON.stringify(settings, null, 2)}
          </FuseHighlight>

          <Typography className="text-16 font-bold mt-24 mb-16">Query Params</Typography>

          {qs.stringify({
            defaultSettings: JSON.stringify(settings, { strictNullHandling: true }),
          })}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FuseSettingsViewerDialog;
