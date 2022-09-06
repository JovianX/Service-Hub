import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import { createRepository } from 'app/store/repositorySlice';

const CreateRepositoryDialog = ({ options }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(options.isCreateModalOpen);
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const repository = { name: e.target.name.value, url: e.target.url.value };
    dispatch(createRepository(repository));
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <form onSubmit={handleSubmitCreate}>
          <DialogTitle className='bg-[#2A3BAB] text-center text-white'>Create new repository</DialogTitle>
          <DialogContent>
            <div>
              <TextField
                name='name'
                type='text'
                required
                id='outlined-required'
                label='Name'
                margin='normal'
                fullWidth
              />
            </div>
            <div>
              <TextField name='url' type='text' required id='outlined-required' label='URL' margin='normal' fullWidth />
            </div>
          </DialogContent>
          <DialogActions className='px-[24px]'>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit' className='ml-12' variant='contained' color='primary' startIcon={<AddIcon />}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateRepositoryDialog;
