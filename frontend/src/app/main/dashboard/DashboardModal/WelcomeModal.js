import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Checkbox, Dialog, DialogContent, DialogTitle, FormGroup } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATHS } from '../../../constants/paths';

import ModalStepper from './ModalStepper';

const WelcomeModal = ({ openModal, setOpenModal, children, onClose, ...other }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (openModal) {
      setOpen(true);
      setOpenModal(false);
    }
  }, [openModal]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle className='bg-primary text-center text-white'>
          Activate Account
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className='p-0 overflow-y-hidden min-h-[250px] flex flex-col justify-around'>
          <ModalStepper />
          <div className='welcome-modal text-center pb-24 px-24'>
            <Typography variant='h6'>
              Hi 👋, welcome to JovianX ServiceHub! <br /> Activate your account by adding a Kubernetes cluster.
            </Typography>
          </div>
          <div className='px-24'>
            <FormGroup className='ml-48'>
              <FormControlLabel disabled control={<Checkbox defaultChecked />} label='Create an account ' />
              <FormControlLabel className='mt-[-10px]' control={<Checkbox />} label='Connect to a Kubernetes cluster' />
            </FormGroup>
          </div>
        </DialogContent>
        <DialogActions className='p-24 justify-end'>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => {
              navigate(`/${PATHS.CLUSTERS}`, {
                state: {
                  openModal: true,
                },
              });
            }}
          >
            Add a Kubernetes cluster
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WelcomeModal;
