import { TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react';

import { getNamespacesList as getNamespacesListAPI } from '../../api';
import { useGetMe } from '../../hooks/useGetMe';
import { formattedNamespace } from '../../uitls/formattedNamespace';

const filter = createFilterOptions();

const NamespacesSelect = ({ hidden, clusterContextName, handleGetNamespace }) => {
  const [namespace, setNamespace] = useState(null);
  const [list, setList] = useState([]);
  const user = useGetMe();

  useEffect(() => {
    namespace &&
    handleGetNamespace(namespace?.name);
  }, [namespace]);

  useEffect(() => {
    const defaultNamespace = {
      name: formattedNamespace(user.email),
      states: 'active',
    };
    setNamespace(defaultNamespace);
  }, [user]);

  useEffect(() => {
    let canceled = false;
    if (clusterContextName) {
      getNamespacesListAPI(clusterContextName).then(
        function ({ data }) {
          if (canceled) {
            return;
          }
          setList(data);
        },
        function () {
          if (canceled) {
            return;
          }
          setList([]);
        },
      );
    }
    return () => {
      canceled = true;
    };
  }, [clusterContextName]);

  return (
    <Autocomplete
      margin='normal'
      fullWidth
      value={namespace}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setNamespace({
            name: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          setNamespace({
            name: newValue.inputValue,
          });
        } else {
          setNamespace(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            name: `Add "${inputValue}"`,
          });
        }
        return filtered;
      }}
      id='namespace'
      options={list}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.name;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      renderOption={(props, option) => <li {...props}>{option.name}</li>}
      sx={{ marginTop: 1.4 }}
      freeSolo
      hidden={hidden}
      renderInput={(params) => <TextField {...params} label='Namespace' />}
    />
  );
};

export default NamespacesSelect;
