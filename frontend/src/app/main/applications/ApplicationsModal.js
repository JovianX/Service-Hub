import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const ApplicationsModal = ({ openModal, setOpenModal }) => {
  const inputRef = useRef();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');

  useEffect(() => {
    if (openModal) {
      setOpen(true);
      setOpenModal(false);
    }
  }, [openModal]);

  // modal actions
  const handleClickSaveButton = (e) => {
    e.preventDefault();
    setInfoMessageError('');
    setInfoMessageSuccess('');
    setLoading(true);
    if (e.target.form) {
      const { chart_name, version, description, release_name, context_name } = e.target.form;

      if (!chart_name.value) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    inputRef.current.click();
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
  };

  const add = () => {
    console.log(1);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <form onSubmit={add}>
          <DialogTitle className='bg-primary text-center text-white'>Create Application</DialogTitle>
          <DialogContent className='pb-0 mt-8 overflow-y-hidden'>
            {/* <div className='mt-24'>Deploy a new Helm release</div> */}
            <TextField
              name='description'
              type='text'
              id='outlined-required'
              label='Description'
              margin='normal'
              fullWidth
            />
          </DialogContent>

          <DialogActions className='p-24 justify-between'>
            <div className='mr-10'>
              <div>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>
              <div>{infoMessageSuccess && <p className='text-green'>{infoMessageSuccess}</p>}</div>
            </div>
            <div className='flex'>
              <Button className='mr-14' onClick={handleClose}>
                Cancel
              </Button>
              <LoadingButton
                color='primary'
                onClick={handleClickSaveButton}
                loading={loading}
                loadingPosition='start'
                startIcon={<AddIcon />}
                variant='contained'
              >
                Create
              </LoadingButton>
              <input ref={inputRef} type='submit' className='hidden' />
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ApplicationsModal;
