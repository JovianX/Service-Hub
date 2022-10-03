import { Button } from '@mui/material';
import List from '@mui/material/List';
import MonacoEditor from '@uiw/react-monacoeditor';
import yaml from 'js-yaml';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import DialogModal from 'app/shared-components/DialogModal';
import {
  deleteTemplate,
  getTemplatesList,
  editTemplate,
  selectInfoMessage,
  selectIsTemplatesLoading,
  selectTemplates,
} from 'app/store/templatesSlice';

import TemplatesListItem from './TemplatesListItem';
import TemplatesModal from './TemplatesModal';

const TemplatesList = () => {
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [transformedTemplates, setTransformedTemplates] = useState([]);
  const [templateId, setTemplateId] = useState('');
  const [templateYamlText, setTemplateYamlText] = useState('');

  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [openModal, setOpenModal] = useState(false);

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
      const names = [];
      let revision = [];
      const newArr = [];
      templates.map((obj, id) => {
        const template = JSON.parse(JSON.stringify(obj));
        names.push(template.name);
        if (
          id + 1 <= templates.length - 1 &&
          names.indexOf(templates[id + 1].name) === names.lastIndexOf(templates[id + 1].name)
        ) {
          newArr.push(template);
        }
        for (let j = id + 1; j <= templates.length - 1; j++) {
          if (template.name === templates[j].name) {
            if (names.indexOf(templates[j].name) === names.lastIndexOf(templates[j].name)) {
              revision.push(templates[j]);
            }
          }
        }
        if (revision.length >= 1) {
          template.reversions = revision;
        }
        revision = [];
        if (template.default) {
          setTemplateId(template.id);
        }
      });
      setTransformedTemplates(newArr);
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
    setTimeout(() => {
      setInfoMessageError('');
      setInfoMessageSuccess('');
    }, 2000);
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

  const handleOnChangeTemplate = (value) => {
    setTemplateYamlText(value);
  };

  const handleClickEdit = async (id) => {
    try {
      const template = yaml.load(templateYamlText, { json: true });
      await dispatch(editTemplate({ id, template }));
    } catch (e) {
      setInfoMessageError(e.reason);
    }
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
        <div className='flex justify-end'>
          <Button
            className='mb-12 mr-12'
            color='primary'
            variant='contained'
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Add templete
          </Button>
        </div>
        {transformedTemplates?.map((template, index) => (
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
            onChange={handleOnChangeTemplate.bind(this)}
            options={{ theme: 'vs-dark', readOnly, automaticLayout: true }}
          />
        </div>
        <div className='mt-36 flex justify-between items-center'>
          <Button size='large' color='error' variant='outlined' onClick={handleDeleteTemplate}>
            Delete
          </Button>
          <div>
            <div>{infoMessageError && <p className='text-red'>{infoMessageError}</p>}</div>
            <div>{infoMessageSuccess && <p className='text-green'>{infoMessageSuccess}</p>}</div>
          </div>
          <Button size='large' color='primary' variant='outlined' onClick={handleClickEdit}>
            Edit
          </Button>
        </div>
      </div>

      <TemplatesModal setTemplates={setTemplates} openModal={openModal} setOpenModal={setOpenModal} />

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
