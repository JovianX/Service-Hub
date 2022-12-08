import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getChartList } from 'app/store/chartsSlice';
import { createTemplate } from 'app/store/templatesSlice';

import { TemplateContext } from '../TemplateProvider';

import TemplatesItem from './TemplatesItem';

const TemplatesModal = ({ openModal, setOpenModal, setTemplates, modalInfo, setEditTemplateId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');

  const {
    configYamlText,
    onChangeYaml,
    inputDescription,
    onChangeInputDescription,
    infoIsYamlValid,
    setInfoIsYamlValid,
  } = useContext(TemplateContext);

  useEffect(() => {
    if (openModal) {
      setOpen(true);
      setOpenModal(false);
      setInfoIsYamlValid('');
      dispatch(getChartList());
    }
  }, [openModal]);

  useEffect(() => {
    if (modalInfo?.action) {
      onChangeInputDescription(modalInfo.template?.description);

      if (modalInfo.action === 'EDIT') {
        onChangeYaml(modalInfo.template?.template);
      } else if (modalInfo.action === 'CREATE') {
        onChangeYaml('');
      }
    }
  }, [modalInfo.template]);

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
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth='xl'
        PaperProps={{
          sx: {
            minHeight: '90vh',
            overflowY: 'hidden',
          },
        }}
      >
        <form onSubmit={handleSubmitTemplate}>
          <DialogTitle className='bg-primary text-center text-white'>{modalInfo.title}</DialogTitle>
          <DialogContent className='pb-0 mt-16 overflow-y-hidden'>
            <TemplatesItem />
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
                disabled={!!infoIsYamlValid}
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
