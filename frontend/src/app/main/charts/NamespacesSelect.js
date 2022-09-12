import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useEffect } from 'react';

import { getNamespacesList as getNamespacesListAPI } from '../../api';

const filter = createFilterOptions();

const NamespacesSelect = ({ clusterContextName, handleGetNamespace }) => {
  const [value, setValue] = React.useState(null);
  const [open, toggleOpen] = React.useState(false);
  const [list, setList] = React.useState([]);

  useEffect(() => {
    handleGetNamespace(value?.name);
  }, [value]);

  useEffect(
    function () {
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
      return function () {
        canceled = true;
      };
    },
    [clusterContextName],
  );

  const handleClose = () => {
    setDialogValue({
      name: '',
      status: '',
    });

    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    name: '',
    status: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue({
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
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
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
            setValue(newValue);
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
        id='free-solo-dialog-demo'
        options={list}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
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
          <DialogTitle>Add a new namespace</DialogTitle>
          <DialogContent>
            <DialogContentText>Did you miss any namespace in our list? Please, add it!</DialogContentText>
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
              label='title'
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
