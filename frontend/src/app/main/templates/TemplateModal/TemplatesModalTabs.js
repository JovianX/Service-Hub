import Editor from '@monaco-editor/react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getChartList } from 'app/store/chartsSlice';

import { TemplateContext } from '../TemplateProvider';

import TemplateBuilder from './TemplateBuilder/TemplateBuilder';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box className='mt-12'>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TemplatesModalTabs = () => {
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);
  const { configYamlText, onChangeYaml, infoIsYamlValid } = useContext(TemplateContext);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getChartList());
  }, [dispatch]);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChangeTab} aria-label='basic tabs example'>
          <Tab label='YAML' {...a11yProps(0)} />
          <Tab label='UI Template Builder' {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Editor
          value={configYamlText}
          height='60vh'
          width='100%'
          language='yaml'
          theme='vs-dark'
          onChange={onChangeYaml}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box display='flex' justifyContent='space-between'>
          <div className='w-3/5 mr-24'>
            <TemplateBuilder />
          </div>
          <div className='w-2/5'>
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
      </TabPanel>
    </Box>
  );
};

export default TemplatesModalTabs;
