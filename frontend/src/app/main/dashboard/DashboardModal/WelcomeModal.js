import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
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
          Activate your account
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
          <div className='text-center pb-24 px-24'>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam aliquid culpa doloremque ea enim illo
              inventore.
            </Typography>
          </div>
        </DialogContent>
        <DialogActions className='p-24 justify-end'>
          <Button
            className='mt-24'
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
