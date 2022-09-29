import SettingsIcon from '@mui/icons-material/Settings';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';
import List from '@mui/material/List';
import MonacoEditor from '@uiw/react-monacoeditor';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import DialogModal from 'app/shared-components/DialogModal';
import {
  deleteTemplate,
  getTemplatesList,
  makeTemplateDefault,
  selectInfoMessage,
  selectIsTemplatesLoading,
  selectTemplates,
} from 'app/store/templatesSlice';

import TemplatesListItem from './TemplatesListItem';

const TemplatesList = () => {
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState('');
  const [templateYamlText, setTemplateYamlText] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const templatesData = useSelector(selectTemplates);
  const isLoading = useSelector(selectIsTemplatesLoading);
  const infoMessage = useSelector(selectInfoMessage);

  useEffect(() => {
    dispatch(getTemplatesList());
  }, [dispatch]);

  useEffect(() => {
    setTemplates(templatesData);
  }, [templatesData]);

  useEffect(() => {
    if (templates.length) {
      templates.map((template) => {
        if (template.default) {
          setTemplateId(template.id);
        }
      });
    }
  }, [templates]);

  useEffect(() => {
    if (infoMessage?.status) {
      showMessage(infoMessage);
      dispatch(getTemplatesList());
    }
  }, [infoMessage]);

  useEffect(() => {
    const templateIndex = templates.findIndex((template) => templateId === template.id);
    const oneTemplate = templates.find((template) => templateId === template.id);
    if (oneTemplate?.template.substring(0, 1) === '\n') {
      setTemplateYamlText(oneTemplate?.template.substring(1));
    } else {
      setTemplateYamlText(oneTemplate?.template);
    }
    setSelectedIndex(templateIndex);
  }, [templateId]);

  const showMessage = (res) => {
    if (res.status === 'success') {
      setInfoMessageSuccess(res.message);
    } else {
      setInfoMessageError(res.message);
    }
    setLoading(false);
    setTimeout(() => {
      setInfoMessageError('');
      setInfoMessageSuccess('');
    }, 2000);
  };

  const handleClickMakeDefaultButton = (id) => {
    setInfoMessageError('');
    setInfoMessageSuccess('');
    setLoading(true);
    dispatch(makeTemplateDefault(id));
  };

  //  delete modal action
  const toggleDeleteModalOpen = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };
  const handleDeleteTemplate = () => {
    setInfoMessageError('');
    setInfoMessageSuccess('');
    toggleDeleteModalOpen();
  };
  const handleDeleteCancel = () => {
    toggleDeleteModalOpen();
  };
  const handleDeleteConfirm = async () => {
    await dispatch(deleteTemplate(templateId));
    toggleDeleteModalOpen();
  };

  if (isLoading) {
    return (
      <div className='w-full flex flex-col min-h-full'>
        <FuseLoading />
      </div>
    );
  }
  return (
    <div className='flex justify-between p-24'>
      <List className='w-5/12 pt-0 h-[70vh] overflow-y-scroll mr-12'>
        {templates?.map((template, index) => (
          <TemplatesListItem
            key={template.id}
            selectedIndex={selectedIndex}
            index={index}
            template={template}
            setTemplateId={setTemplateId}
          />
        ))}
      </List>

      <div className='w-7/12'>
        <div style={{ height: 'calc(100vh - 304px)' }}>
          <MonacoEditor
            height='100%'
            value={templateYamlText}
            language='yaml'
            options={{ theme: 'vs-dark', readOnly: true, automaticLayout: true }}
          />
        </div>
        <div className='mt-36 flex justify-between items-center'>
          <Button size='large' color='primary' variant='outlined' onClick={handleDeleteTemplate}>
            Delete
          </Button>

          <div>
            <div>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>
            <div>{infoMessageSuccess && <p className='text-green'>{infoMessageSuccess}</p>}</div>
          </div>

          <LoadingButton
            size='large'
            color='primary'
            onClick={() => handleClickMakeDefaultButton(templateId)}
            loading={loading}
            loadingPosition='start'
            startIcon={<SettingsIcon />}
            variant='contained'
          >
            Set Default
          </LoadingButton>
        </div>
      </div>

      <DialogModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        title='Delete template'
        text='Are you sure you want to proceed?'
        onCancel={handleDeleteCancel}
        cancelText='Cancel'
        onConfirm={handleDeleteConfirm}
        confirmText='Delete'
        fullWidth
      />
    </div>
  );
};

export default TemplatesList;
