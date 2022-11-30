import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getChartList } from 'app/store/chartsSlice';

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

const TemplatesModalTabs = ({ templateBuilder, setTemplateBuilder }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);

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
      <TabPanel value={value} index={0} />
      <TabPanel value={value} index={1}>
        <TemplateBuilder templateBuilder={templateBuilder} setTemplateBuilder={setTemplateBuilder} />
      </TabPanel>
    </Box>
  );
};

export default TemplatesModalTabs;
