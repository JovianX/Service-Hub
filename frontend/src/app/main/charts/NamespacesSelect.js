import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react';

import { getNamespacesList as getNamespacesListAPI } from '../../api';
import { useGetMe } from '../../hooks/useGetMe';

const filter = createFilterOptions();

const NamespacesSelect = ({ clusterContextName, handleGetNamespace }) => {
  const [namespace, setNamespace] = useState(null);
  const [open, toggleOpen] = useState(false);
  const [list, setList] = useState([]);
  const user = useGetMe();

  useEffect(() => {
    handleGetNamespace(namespace?.name);
  }, [namespace]);

  useEffect(() => {
    const defaultNamespace = {
      name: user.email.replace('@', '--').replace('.', '-'),
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

  const handleClose = () => {
    setDialogValue({
      name: '',
      status: '',
    });

    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = useState({
    name: '',
    status: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setNamespace({
      name: dialogValue.name,
      status: dialogValue.status,
    });

    handleClose();
  };

  return (
    <>
      <Autocomplete
        margin='normal'
        fullWidth
        value={namespace}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                name: newValue,
                status: 'Active',
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              name: newValue.inputValue,
              status: 'Active',
            });
          } else {
            setNamespace(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
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
        renderInput={(params) => <TextField {...params} required label='Namespace' />}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create a new namespace</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>Create a new Namespace</DialogContentText> */}
            <TextField
              fullWidth
              autoFocus
              margin='dense'
              id='name'
              value={dialogValue.title}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  name: event.target.value,
                })
              }
              label='Namespace name'
              type='text'
              variant='standard'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit'>Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default NamespacesSelect;
