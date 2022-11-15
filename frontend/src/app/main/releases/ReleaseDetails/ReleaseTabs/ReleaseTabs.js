import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { getHemlReleaseHistory } from 'app/store/releaseSlice';

import { getTubValues } from '../../../../api';

import HelmHistory from './HelmHistory';
import HelmReleaseDetails from './HelmReleaseDetails';

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

const APIsList = ['user-supplied-values', 'computed-values', 'detailed-hooks', 'notes', 'detailed-manifest'];

const ReleaseTabs = ({ release }) => {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const [tabValues, setTabValues] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    tabValuesRequest();
    if (release?.name) {
      dispatch(
        getHemlReleaseHistory({
          context_name: release.context_name,
          namespace: release.namespace,
          release_name: release.name,
        }),
      );
    }
  }, [release]);

  function tabValuesRequest() {
    if (release?.name) {
      APIsList.map((row) => {
        getTubValues(release.context_name, release.namespace, release.name, row).then((res) => {
          const tabValues = {};
          tabValues[row.replace(/-/gi, '_')] = res.data;
          setTabValues((value) => ({ ...value, ...tabValues }));
        });
      });
    }
  }

  return (
    <Box sx={{ width: '100%', marginTop: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
          <Tab label='Helm release details' {...a11yProps(0)} />
          <Tab label='Helm history' {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <HelmReleaseDetails tabValues={tabValues} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HelmHistory release={release} />
      </TabPanel>
    </Box>
  );
};

export default ReleaseTabs;
