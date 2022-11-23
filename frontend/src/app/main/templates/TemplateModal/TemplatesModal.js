import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import MonacoEditor from '@uiw/react-monacoeditor';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { createTemplate } from 'app/store/templatesSlice';

import TemplatesModalTabs from './TemplatesModalTabs';

const TemplatesModal = ({ openModal, setOpenModal, setTemplates, modalInfo, setEditTemplateId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [configYamlText, setConfigYamlText] = useState('');
  const [defaultConfigYamlText, setDefaultConfigYamlText] = useState('');
  const [inputDescription, setInputDescription] = useState('');

  useEffect(() => {
    if (openModal) {
      setOpen(true);
      setOpenModal(false);
    }
  }, [openModal]);

  useEffect(() => {
    if (modalInfo?.action) {
      setInputDescription(modalInfo.template?.description);
      if (modalInfo.action === 'EDIT') {
        setConfigYamlText(modalInfo.template?.template);
        setDefaultConfigYamlText(modalInfo.template?.template);
      } else if (modalInfo.action === 'CREATE') {
        setConfigYamlText('');
        setDefaultConfigYamlText('');
      }
    }
  }, [modalInfo.template]);

  useEffect(() => {
    if (infoMessageError) {
      setInfoMessageError('');
    }
  }, [configYamlText]);

  const onChangeInputDescription = (e) => {
    setInputDescription(e.target.value);
    if (infoMessageError) {
      setInfoMessageError('');
    }
  };

  const handleGetValue = (newValue) => {
    setConfigYamlText(newValue);
  };

  const handleSubmitTemplate = async (e) => {
    if (infoMessageError) {
      setInfoMessageError('');
    }
    e.preventDefault();
    setLoading(true);
    const { description } = e.target;
    try {
      let data = {};
      let requestBody = {};
      if (modalInfo?.action === 'EDIT') {
        requestBody = {
          description: inputDescription,
          template: configYamlText,
          enabled: true,
        };
        data = await dispatch(createTemplate(requestBody));
      } else if (modalInfo?.action === 'CREATE') {
        requestBody = {
          description: description.value,
          template: configYamlText,
          enabled: true,
        };
        data = await dispatch(createTemplate(requestBody));
      }
      if (data.payload.status === 'error') {
        setInfoMessageError(data.payload.message);
      } else {
        if (modalInfo?.action === 'EDIT') {
          setEditTemplateId(data.payload.id);
        }
        setTemplates((templates) => [...templates, data.payload]);
        setInfoMessageSuccess('The template was created successfully');
        setTimeout(() => setOpen(false), 2000);
      }
      setLoading(false);
      setTimeout(() => {
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
        <form onSubmit={handleSubmitTemplate}>
          <DialogTitle className='bg-primary text-center text-white'>{modalInfo.title}</DialogTitle>
          <DialogContent className='pb-0 mt-16 overflow-y-hidden'>
            {/* <div className='mt-24'>create new template</div> */}
            <TextField
              value={inputDescription || ''}
              onChange={onChangeInputDescription}
              name='description'
              type='text'
              id='outlined-required'
              label='Description'
              margin='normal'
              fullWidth
            />
            <TemplatesModalTabs setDefaultConfigYamlText={setDefaultConfigYamlText} />
            <MonacoEditor
              value={defaultConfigYamlText || this}
              height='350px'
              width='100%'
              name='values'
              language='yaml'
              theme='vs-dark'
              onChange={handleGetValue.bind(this)}
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
                type='submit'
                loading={loading}
                loadingPosition='start'
                startIcon={[
                  modalInfo.action === 'CREATE' && <AddIcon key={modalInfo.action} />,
                  modalInfo.action === 'EDIT' && <EditIcon key={modalInfo.action} />,
                ]}
                variant='contained'
              >
                {modalInfo.confirmText}
              </LoadingButton>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default TemplatesModal;
