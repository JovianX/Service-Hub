import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Button, List, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MonacoEditor from '@uiw/react-monacoeditor';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import DialogModal from 'app/shared-components/DialogModal';
import { getContextList } from 'app/store/clustersSlice';
import {
  deleteTemplate,
  getTemplatesList,
  selectInfoMessage,
  selectIsTemplatesLoading,
  selectTemplates,
} from 'app/store/templatesSlice';
import { selectUser } from 'app/store/userSlice';

import CatalogList from './CatalogsList/CatalogList';
import TemplatesListItem from './TemplatesListItem';
import TemplatesModal from './TemplatesModal';

const TemplatesList = () => {
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [transformedTemplates, setTransformedTemplates] = useState([]);
  const [templateId, setTemplateId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [templateYamlText, setTemplateYamlText] = useState('');

  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    action: '',
    title: '',
    confirmText: '',
    template: {},
  });
  const [editTemplateId, setEditTemplateId] = useState('');
  const [alignment, setAlignment] = useState('catalog');

  const templatesData = useSelector(selectTemplates);
  const isLoading = useSelector(selectIsTemplatesLoading);
  const infoMessage = useSelector(selectInfoMessage);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getTemplatesList());
    dispatch(getContextList());
  }, [dispatch]);

  useEffect(() => {
    setTemplateId(selectedTemplateId);
  }, [selectedTemplateId]);

  useEffect(() => {
    setTemplates(templatesData);
  }, [templatesData]);

  useEffect(() => {
    if (templates.length) {
      const unique = [...new Set(templates.map((item) => item.name))];
      const res = unique.map((item) => ({
        name: item,
        templates: templates.filter((searchItem) => searchItem.name === item).reverse(),
      }));
      setTransformedTemplates(res);
      if (!selectedTemplateId) {
        setTemplateId(res[0].templates[0].id);
      }
    }
  }, [templates]);

  useEffect(() => {
    if (infoMessage?.status) {
      showMessage(infoMessage);
      dispatch(getTemplatesList());
    }
  }, [infoMessage]);

  useEffect(() => {
    const templateIndex = transformedTemplates.findIndex((template) => {
      return template.templates.find((item) => templateId === item.id);
    });
    const oneTemplate = templates.find((template) => templateId === template.id);
    if (oneTemplate?.template.substring(0, 1) === '\n') {
      setTemplateYamlText(oneTemplate?.template.substring(1));
    } else {
      setTemplateYamlText(oneTemplate?.template);
    }
    setSelectedIndex(templateIndex);
    setInfoMessageError('');
  }, [templateId]);

  useEffect(() => {
    const oneTemplate = templates.find((template) => editTemplateId === template.id);
    if (oneTemplate?.template.substring(0, 1) === '\n') {
      setTemplateYamlText(oneTemplate?.template.substring(1));
    } else {
      setTemplateYamlText(oneTemplate?.template);
    }
  }, [editTemplateId]);

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

  const handleClickEdit = () => {
    try {
      const template = templates.find((template) => templateId === template.id);
      setModalInfo({
        action: 'EDIT',
        title: `Edit ${template.name}`,
        confirmText: 'Save',
        template,
      });
      setOpenModal(true);
    } catch (e) {
      setInfoMessageError('Please select a template');
      setTimeout(() => {
        setInfoMessageError('');
      }, 2000);
    }
  };

  const handleClickAdd = () => {
    setInfoMessageError('');
    setModalInfo({
      action: 'CREATE',
      title: 'New template',
      confirmText: 'Add',
    });
    setOpenModal(true);
  };

  const handleChangeAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  if (isLoading) {
    return (
      <div className='w-full flex flex-col min-h-full'>
        <FuseLoading />
      </div>
    );
  }
  return (
    <div className='p-24'>
      {user?.role === 'admin' && (
        <div className='flex justify-between items-center mb-12'>
          <ToggleButtonGroup
            color='primary'
            value={alignment}
            exclusive
            onChange={handleChangeAlignment}
            aria-label='Platform'
          >
            <ToggleButton value='catalog'>
              Catalog <GridViewIcon className='ml-6' />
            </ToggleButton>
            <ToggleButton value='templates'>
              Templates <ViewListIcon className='ml-6' />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button color='primary' variant='contained' onClick={handleClickAdd}>
            Add templete
          </Button>
        </div>
      )}

      {user?.role === 'admin' && alignment === 'templates' ? (
        <div className='flex justify-between'>
          <List className='w-5/12 pt-0 h-[70vh] overflow-y-scroll mr-12'>
            {transformedTemplates?.map((template, index) => (
              <TemplatesListItem
                key={template.name}
                selectedIndex={selectedIndex}
                mainIndex={index}
                template={template.templates}
                setTemplateId={setTemplateId}
                setSelectedTemplateId={setSelectedTemplateId}
                setTemplates={setTemplates}
                alignment={alignment}
              />
            ))}
          </List>

          <div className='w-7/12'>
            <div style={{ height: 'calc(100vh - 364px)' }}>
              <MonacoEditor
                height='100%'
                value={templateYamlText}
                language='yaml'
                onChange={handleOnChangeTemplate.bind(this)}
                options={{ theme: 'vs-dark', readOnly: true, automaticLayout: true }}
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
      ) : (
        <div className='flex'>
          <CatalogList transformedTemplates={transformedTemplates} />
        </div>
      )}
      <TemplatesModal
        setTemplates={setTemplates}
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalInfo={modalInfo}
        setEditTemplateId={setEditTemplateId}
      />
    </div>
  );
};

export default TemplatesList;
