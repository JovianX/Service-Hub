import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getChartList } from 'app/store/chartsSlice';

import ChartSelector from './ComponentSelectors/ChartSelector';
import TypeSelector from './ComponentSelectors/TypeSelector';
import VersionSelector from './ComponentSelectors/VersionSelector';
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

const TemplatesModalTabs = ({ setDefaultConfigYamlText }) => {
  const dispatch = useDispatch();
  const [components, setComponents] = useState([]);
  const [open, setOpen] = useState(false);
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
        <div className='py-12'>
          <Box className='my-6'>
            {components?.map((component, index) => {
              return (
                <div key={index} className='grid grid-cols-2 gap-10 mb-24'>
                  {component.map((item, i) => (
                    <React.Fragment key={item?.field_name + i}>
                      {item ? (
                        <div key={item.field_name + value + i} className='w-full'>
                          {item.field_name === 'name' && (
                            <TextField
                              size='small'
                              type='text'
                              fullWidth
                              defaultValue={item.value}
                              required
                              className='mr-10'
                              label={item.label}
                            />
                          )}
                          {item.field_name === 'type' && <TypeSelector typeValue={item.value} />}
                          {item.field_name === 'chart' && <ChartSelector chartValue={item.value} />}
                          {item && item.field_name === 'version' && <VersionSelector versionValue={item.value} />}
                          {item && item.field_name === 'key' && (
                            <TextField
                              type='text'
                              label={item.label}
                              defaultValue={item.value}
                              size='small'
                              fullWidth
                            />
                          )}
                          {item && item.field_name === 'value' && (
                            <TextField
                              type='text'
                              label={item.value}
                              defaultValue={item.value}
                              size='small'
                              fullWidth
                            />
                          )}
                        </div>
                      ) : (
                        ''
                      )}
                    </React.Fragment>
                  ))}
                </div>
              );
            })}
          </Box>

          <Button
            className='group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer'
            onClick={() => setOpen(true)}
          >
            <FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>
            <span className='ml-8 font-medium text-secondary group-hover:underline'>
              {components.length > 0 ? 'Add another component' : 'Add a Component'}
            </span>
          </Button>

          <TemplateBuilder
            open={open}
            setOpen={setOpen}
            components={components}
            setComponents={setComponents}
            setDefaultConfigYamlText={setDefaultConfigYamlText}
          />
        </div>
      </TabPanel>
    </Box>
  );
};

export default TemplatesModalTabs;
