import Editor from '@monaco-editor/react';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { useContext } from 'react';

import { TemplateContext } from '../TemplateProvider';

import TemplateBuilder from './TemplateBuilder/TemplateBuilder';

const TemplatesItem = () => {
  const {
    templateBuilder,
    setTemplateBuilder,
    configYamlText,
    onChangeYaml,
    inputDescription,
    onChangeInputDescription,
  } = useContext(TemplateContext);

  const onChangeApplicationName = (e) => {
    setTemplateBuilder((template) => {
      let name = template?.name || '';
      name = e.target.value;
      return { ...template, name };
    });
  };

  return (
    <>
      <Box display='flex' justifyContent='space-between'>
        <div className='w-3/5 mr-24'>
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
            onChange={(e) => onChangeInputDescription(e.target.value)}
          />
          <TemplateBuilder />
        </div>
        <div className='w-2/5 mt-12'>
          <div className='mt-4' style={{ height: 'calc(100vh - 250px)' }}>
            <Editor
              value={configYamlText}
              height='100%'
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
