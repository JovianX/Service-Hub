import Editor from '@monaco-editor/react';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getChartList } from 'app/store/chartsSlice';

import { TemplateContext } from '../TemplateProvider';

import TemplateBuilder from './TemplateBuilder/TemplateBuilder';

const TemplatesItem = () => {
  const dispatch = useDispatch();
  const {
    templateBuilder,
    setTemplateBuilder,
    configYamlText,
    onChangeYaml,
    infoIsYamlValid,
    inputDescription,
    onChangeInputDescription,
  } = useContext(TemplateContext);

  useEffect(() => {
    dispatch(getChartList());
  }, [dispatch]);

  const onChangeApplicationName = (e) => {
    setTemplateBuilder((template) => {
      let name = template?.name || '';
      name = e.target.value;
      return { ...template, name };
    });
  };

  return (
    <>
      <TextField
        value={templateBuilder?.name || ''}
        name='name'
        type='text'
        id='outlined-required'
        label='Application name'
        margin='normal'
        fullWidth
        onChange={onChangeApplicationName}
      />
      <TextField
        value={inputDescription || ''}
        name='description'
        type='text'
        id='outlined-required'
        label='Description'
        margin='normal'
        fullWidth
        onChange={onChangeInputDescription}
      />

      <Box display='flex' justifyContent='space-between'>
        <div className='w-3/5 mr-24'>
          <TemplateBuilder />
        </div>
        <div className='w-2/5 mt-12'>
          <div className='h-[39px] flex items-center'>
            {infoIsYamlValid && <p className='text-red'>{infoIsYamlValid}</p>}
          </div>
          <div className='mt-24'>
            <Editor
              value={configYamlText}
              height='80vh'
              width='100%'
              language='yaml'
              theme='vs-dark'
              onChange={onChangeYaml}
            />
          </div>
        </div>
      </Box>
    </>
  );
};

export default TemplatesItem;
