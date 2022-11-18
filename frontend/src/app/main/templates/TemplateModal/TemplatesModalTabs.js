import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useState } from 'react';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import TemplateBuilder from './TemplateBuilder';

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
  const [components, setComponents] = useState([]);
  const [open, setOpen] = useState(false);

  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

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
        <div className='py-12'>
          <Button
            className='group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer'
            onClick={() => setOpen(true)}
          >
            <FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>
            <span className='ml-8 font-medium text-secondary group-hover:underline'>Add a component</span>
          </Button>

          {components?.map((component) => (
            <div className='flex w-full' key={component.components.name}>
              <TextField type='text' fullWidth defaultValue={component.components.name} />
              <Button variant='text' color='error'>
                <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
              </Button>
            </div>
          ))}

          <TemplateBuilder open={open} setOpen={setOpen} setComponents={setComponents} />
        </div>
      </TabPanel>
    </Box>
  );
};

export default TemplatesModalTabs;
