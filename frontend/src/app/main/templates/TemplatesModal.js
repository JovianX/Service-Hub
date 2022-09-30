import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import MonacoEditor from '@uiw/react-monacoeditor';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { createTemplate } from 'app/store/templatesSlice';

const TemplatesModal = ({ openModal, setOpenModal, setTemplates }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [configYamlText, setConfigYamlText] = useState('');

  useEffect(() => {
    if (openModal) {
      setOpen(true);
      setOpenModal(false);
    }
  }, [openModal]);

  const getValue = (newValue) => {
    setConfigYamlText(newValue);
  };

  // modal actions
  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { description } = e.target;
    try {
      const template = {
        description: description.value,
        template: configYamlText,
        enabled: true,
      };
      const data = await dispatch(createTemplate(template));
      if (data.payload.status === 'error') {
        setInfoMessageError(data.payload.message);
      } else {
        setTemplates((templates) => [...templates, data.payload]);
        setInfoMessageSuccess('The template was created successfully');
        setTimeout(() => setOpen(false), 2000);
      }
      setLoading(false);
      setTimeout(() => {
        setInfoMessageError('');
        setInfoMessageSuccess('');
      }, 2000);
    } catch (e) {
      await setLoading(false);
      await setInfoMessageError(e.reason);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <form onSubmit={handleSubmitCreate}>
          <DialogTitle className='bg-primary text-center text-white'>Create new template</DialogTitle>
          <DialogContent className='pb-0 mt-16 overflow-y-hidden'>
            {/* <div className='mt-24'>create new template</div> */}
            <TextField
              name='description'
              type='text'
              id='outlined-required'
              label='Description'
              margin='normal'
              fullWidth
            />
            <div className='mt-24'>
              <MonacoEditor
                height='350px'
                width='100%'
                name='values'
                language='yaml'
                theme='vs-dark'
                onChange={getValue.bind(this)}
              />
            </div>
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
                type='submit'
                loading={loading}
                loadingPosition='start'
                startIcon={<AddIcon />}
                variant='contained'
              >
                Create
              </LoadingButton>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default TemplatesModal;
