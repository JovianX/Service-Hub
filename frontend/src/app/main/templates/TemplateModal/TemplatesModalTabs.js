import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getChartList } from 'app/store/chartsSlice';

import TemplateFormBuilder from './TemplateFormBuilder/TemplateFormBuilder';

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

const TemplatesModalTabs = ({ configYamlText, defaultConfigYamlText, setDefaultConfigYamlText }) => {
  const dispatch = useDispatch();
  const [components, setComponents] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleDeleteComponent = (component) => {
    setComponents((components) => components.filter((item) => item[0].value !== component[0].value));
    const configYamlArray = configYamlText.split('\n');
    const filterComponent = component.filter((item) => item && item.value);
    const firstIndex = configYamlArray.findIndex((row) => row.includes(` - name: ${filterComponent[0].value} `));
    const lastIndex = configYamlArray.findIndex((row) =>
      row.includes(filterComponent[filterComponent.length - 1].value),
    );
    let newConfigYaml = [];
    if (components.length > 1) {
      newConfigYaml = [
        ...configYamlArray.slice(0, firstIndex),
        ...configYamlArray.slice(lastIndex + 1, configYamlArray.length),
      ];
    } else {
      newConfigYaml = [
        ...configYamlArray.slice(0, firstIndex - 2),
        ...configYamlArray.slice(lastIndex + 1, configYamlArray.length),
      ];
    }

    setDefaultConfigYamlText(newConfigYaml.join('\n'));
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
                <React.Fragment key={component[0].field_name + index}>
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
                            {item.field_name === 'version' && item.value ? (
                              <VersionSelector versionValue={item.value} />
                            ) : (
                              <div />
                            )}
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
                  <Box display='flex' justifyContent='end' alignItems='center'>
                    <Button key={component[0].field_name + index} onClick={() => handleDeleteComponent(component)}>
                      Delete
                    </Button>
                  </Box>
                </React.Fragment>
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

          <TemplateFormBuilder
            open={open}
            defaultConfigYamlText={defaultConfigYamlText}
            setOpen={setOpen}
            components={components}
            setComponents={setComponents}
            setDefaultConfigYamlText={setDefaultConfigYamlText}
            configYamlText={configYamlText}
          />
        </div>
      </TabPanel>
    </Box>
  );
};

export default TemplatesModalTabs;
