import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getVersionsList as getVersionsListAPI } from '../../../../api';

const VersionSelector = ({ version, setVersion, versionValue }) => {
  const [versionsList, setVersionsList] = useState([]);
  const chartName = useSelector((state) => state.charts.chartName);

  useEffect(() => {
    let canceled = false;
    if (chartName && setVersion) {
      getVersionsListAPI(chartName).then(
        function ({ data }) {
          if (canceled) {
            return;
          }
          const versions = [];
          data.forEach((item) => {
            versions.push(item.version);
          });
          setVersionsList(versions);
        },
        function () {
          if (canceled) {
            return;
          }
          setVersionsList([]);
        },
      );
    }
    return () => {
      canceled = true;
    };
  }, [chartName]);

  const handleChangeVersion = (e) => {
    setVersion(e.target.value);
  };

  return (
    <FormControl size='small' fullWidth className={`mb-10 ${!versionValue ? 'ml-10' : ''}`}>
      <InputLabel>Version</InputLabel>
      <Select
        name='version'
        value={versionValue || version}
        required
        label='Version'
        onChange={handleChangeVersion}
        MenuProps={{ PaperProps: { sx: { maxHeight: 400 } } }}
      >
        {!versionValue ? (
          versionsList?.map((versionsList) => (
            <MenuItem key={versionsList} value={versionsList}>
              {versionsList}
            </MenuItem>
          ))
        ) : (
          <MenuItem key={versionValue} value={versionValue}>
            {versionValue}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default VersionSelector;
