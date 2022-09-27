import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';
import List from '@mui/material/List';
import MonacoEditor from '@uiw/react-monacoeditor';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import {
  getTemplatesList,
  makeTemplateDefault,
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
  const templatesData = useSelector(selectTemplates);
  const isLoading = useSelector(selectIsTemplatesLoading);
  const [loading, setLoading] = useState(false);
  const [infoMessageError, setInfoMessageError] = useState('');
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');

  useEffect(() => {
    dispatch(getTemplatesList());
  }, [dispatch]);

  useEffect(() => {
    setTemplates(templatesData);
  }, [templatesData]);

  useEffect(() => {
    if (templates.length) {
      setTemplateId(templates[0].id);
    }
  }, [templates]);

  useEffect(() => {
    setInfoMessageError('');
    setInfoMessageSuccess('');
    const templateIndex = templates.findIndex((template) => templateId === template.id);
    const oneTemplate = templates.find((template) => templateId === template.id);
    if (oneTemplate?.template.substring(0, 1) === '\n') {
      setTemplateYamlText(oneTemplate?.template.substring(1));
    } else {
      setTemplateYamlText(oneTemplate?.template);
    }
    setSelectedIndex(templateIndex);
  }, [templateId]);

  const getValue = (newValue) => {
    setTemplateYamlText(newValue);
  };

  const showMessage = (res) => {
    if (res.status === 'success') {
      setInfoMessageSuccess(res.message);
    } else {
      setInfoMessageError(res.message);
    }
    setLoading(false);
  };

  const handleClickMakeDefaultButton = async (id) => {
    setLoading(true);
    await dispatch(makeTemplateDefault(id)).then((res) => {
      showMessage(res.payload);
      setTimeout(() => {
        setInfoMessageError('');
        setInfoMessageSuccess('');
      }, 2000);
    });
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
      <div className='w-7/12 h-[70vh]'>
        <MonacoEditor
          value={templateYamlText}
          language='yaml'
          options={{ theme: 'vs-dark' }}
          onChange={getValue.bind(this)}
        />
        <div className='mt-36 mb-24 flex justify-between items-center'>
          <Button size='large' color='primary' variant='outlined'>
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
            startIcon={<SaveIcon />}
            variant='contained'
          >
            Set Default
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default TemplatesList;
