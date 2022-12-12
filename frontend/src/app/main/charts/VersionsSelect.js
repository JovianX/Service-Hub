import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

import { getVersionsList as getVersionsListAPI } from '../../api';

const VersionsSelect = ({ chartName, chartVersion, setChartVersion, startVersion, setStartVersion }) => {
  const [versionsList, setVersionsList] = useState([]);


  useEffect(() => {
    if (chartVersion && !startVersion) {
      setStartVersion(chartVersion);
    }
  }, [chartVersion]);

  useEffect(() => {
    if (chartVersion) {
      if (startVersion === chartVersion) {
        setVersionsList((list) => [...list, startVersion]);
      }
    }
  }, [startVersion]);

  useEffect(() => {
    let canceled = false;
    if (chartName) {
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

  useEffect(() => {
    if (versionsList.length) {
      setChartVersion(versionsList[0]);
    }
  }, [versionsList]);

  const handleChangeSelect = (e) => {
    setChartVersion(e.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl margin='normal' fullWidth required>
        <InputLabel id='version'>Versions</InputLabel>
        <Select
          name='version'
          labelId='version'
          value={chartVersion}
          required
          label='Versions'
          onChange={handleChangeSelect}
          MenuProps={{ PaperProps: { sx: { maxHeight: 400 } } }}
        >
          {versionsList.map((version) => (
            <MenuItem key={version} value={version}>
              {version}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default VersionsSelect;
