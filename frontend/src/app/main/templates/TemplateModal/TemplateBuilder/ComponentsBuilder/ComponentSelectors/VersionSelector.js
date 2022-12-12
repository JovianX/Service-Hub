import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getVersionsList as getVersionsListAPI } from '../../../../../../api';

const VersionSelector = ({ index, versionValue, handleOnChangeComponent, infoIsYamlValid }) => {
  const [version, setVersion] = useState('');
  const [versionsList, setVersionsList] = useState([versionValue]);
  const chartName = useSelector((state) => state.charts.chartName);

  useEffect(() => {
    setVersion('');
    if (versionValue) {
      setVersion(versionValue);
    }
  }, [versionValue]);

  useEffect(() => {
    let canceled = false;
    setVersionsList([versionValue]);
    if (chartName) {
      setVersionsList([]);
      getVersionsListAPI(chartName).then(
        function ({ data }) {
          if (canceled) {
            return;
          }
          const versions = [''];
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
    handleOnChangeComponent(e.target.value, index, 'version');
  };

  return (
    <FormControl size='small' fullWidth disabled={!!infoIsYamlValid}>
      <InputLabel>Version</InputLabel>
      <Select
        name='version'
        value={version}
        label='Version'
        onChange={handleChangeVersion}
        MenuProps={{ PaperProps: { sx: { maxHeight: 400 } } }}
      >
        {versionsList?.map((version, index) => {
          if (version) {
            return (
              <MenuItem key={index} value={version}>
                {version}
              </MenuItem>
            );
          }
          return (
            <MenuItem key={index} value={version}>
              <em>None</em>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default VersionSelector;
