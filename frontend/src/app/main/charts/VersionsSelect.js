import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

import { getVersionsList as getVersionsListAPI } from '../../api';

const VersionsSelect = ({ chartName, chartVersion, setChartVersion }) => {
  const [versionsList, setVersionsList] = useState([]);

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
          name='context_name'
          labelId='version'
          value={chartVersion}
          required
          label='Versions'
          onChange={handleChangeSelect}
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
