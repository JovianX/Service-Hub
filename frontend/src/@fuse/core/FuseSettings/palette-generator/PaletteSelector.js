import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import { darkPaletteText, lightPaletteText } from 'app/configs/themesConfig';
import { darken, getContrastRatio, lighten } from '@mui/material/styles';
import { useTheme } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Dialog, DialogActions, DialogContent, Icon, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import SectionPreview from './SectionPreview';
import PalettePreview from './PalettePreview';

function isDark(color) {
  return getContrastRatio(color, '#ffffff') >= 3;
}

function PaletteSelector(props) {
  const { value } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();

  const methods = useForm({
    defaultValues: {},
    mode: 'onChange',
  });

  const { reset, formState, trigger, handleSubmit, watch, control, setValue } = methods;

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    reset(value);
  }, [value, reset]);

  const form = watch();
  const formType = watch('palette.mode');

  useEffect(() => {
    // console.info(form);
  }, [form]);

  useEffect(() => {
    if (!formType || !openDialog) {
      return;
    }

    setTimeout(() => trigger(['palette.background.paper', 'palette.background.default']));
  }, [formType, openDialog, trigger]);

  const backgroundColorValidation = (v) => {
    if (formType === 'light' && isDark(v)) {
      return 'Must be a light color';
    }
    if (formType === 'dark' && !isDark(v)) {
      return 'Must be a dark color';
    }
    return true;
  };

  /**
   * Open Dialog
   */
  function handleOpenDialog(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    setOpenDialog(true);
  }

  /**
   * Close Dialog
   */
  function handleCloseDialog() {
    setOpenDialog(false);
  }

  function onSubmit(formData) {
    props.onChange(formData);
    handleCloseDialog();
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
      <div onClick={handleOpenDialog} role="button">
        {props.trigger}
      </div>
      <Dialog
        container={document.body}
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
        classes={{
          paper: 'rounded-5 w-full',
        }}
      >
        <AppBar elevation={0} position="static">
          <Toolbar className="flex w-full">
            <Icon className="mr-12">palette</Icon>
            <Typography variant="subtitle1" color="inherit">
              Edit palette
            </Typography>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <div className="flex w-full">
            <div className="flex flex-col items-center justify-center p-24 flex-1">
              <Controller
                name="palette.mode"
                control={control}
                render={({ field: { onChange: _onChange, value: _value } }) => (
                  <ButtonGroup
                    disableElevation
                    variant="contained"
                    color="secondary"
                    className="mb-32"
                  >
                    <Button
                      onClick={async () => {
                        _onChange('light');
                        setValue('palette.text', lightPaletteText, { shouldDirty: true });
                      }}
                      variant={_value === 'light' ? 'contained' : 'outlined'}
                    >
                      Light
                    </Button>

                    <Button
                      onClick={async () => {
                        _onChange('dark');
                        setValue('palette.text', darkPaletteText, { shouldDirty: true });
                      }}
                      variant={_value === 'dark' ? 'contained' : 'outlined'}
                    >
                      Dark
                    </Button>
                  </ButtonGroup>
                )}
              />

              <Controller
                name="palette.primary.main"
                control={control}
                render={({ field: { onChange: _onChange, value: _value } }) => (
                  <TextField
                    value={_value}
                    onChange={(ev) => {
                      _onChange(ev.target.value);
                      setValue('palette.primary.light', lighten(ev.target.value, 0.8), {
                        shouldDirty: true,
                      });
                      setValue('palette.primary.dark', darken(ev.target.value, 0.2), {
                        shouldDirty: true,
                      });
                      setValue(
                        'palette.primary.contrastText',
                        theme.palette.getContrastText(ev.target.value),
                        { shouldDirty: true }
                      );
                    }}
                    type="color"
                    variant="outlined"
                    className="mb-32"
                    label="Primary color"
                    InputProps={{ className: 'w-200  h-32' }}
                  />
                )}
              />

              <Controller
                name="palette.secondary.main"
                control={control}
                render={({ field: { onChange: _onChange, value: _value } }) => (
                  <TextField
                    value={_value}
                    onChange={(ev) => {
                      _onChange(ev.target.value);
                      setValue('palette.secondary.light', lighten(ev.target.value, 0.8), {
                        shouldDirty: true,
                      });
                      setValue('palette.secondary.dark', darken(ev.target.value, 0.2), {
                        shouldDirty: true,
                      });
                      setValue(
                        'palette.secondary.contrastText',
                        theme.palette.getContrastText(ev.target.value),
                        { shouldDirty: true }
                      );
                    }}
                    type="color"
                    variant="outlined"
                    className="mb-32"
                    label="Secondary color"
                    InputProps={{ className: 'w-200 h-32' }}
                  />
                )}
              />

              <Controller
                name="palette.background.paper"
                control={control}
                rules={{
                  validate: {
                    backgroundColorValidation,
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="color"
                    variant="outlined"
                    className="mb-32"
                    label="Background paper"
                    InputProps={{ className: 'w-200 h-32' }}
                    error={!!errors?.palette?.background?.paper}
                    helperText={errors?.palette?.background?.paper?.message}
                  />
                )}
              />

              <Controller
                name="palette.background.default"
                control={control}
                rules={{
                  validate: {
                    backgroundColorValidation,
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="color"
                    variant="outlined"
                    className=""
                    label="Background default"
                    InputProps={{ className: 'w-200 h-32' }}
                    error={!!errors?.palette?.background?.default}
                    helperText={errors?.palette?.background?.default?.message}
                  />
                )}
              />
            </div>

            <div className="flex flex-col items-center justify-center p-48">
              <Typography className="text-16 font-semibold mb-16 -mt-48" color="text.secondary">
                Preview
              </Typography>
              <PalettePreview className="" palette={form.palette} />
            </div>
          </div>
        </DialogContent>
        <DialogActions className="flex justify-between p-16">
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            autoFocus
            onClick={handleSubmit(onSubmit)}
            disabled={_.isEmpty(dirtyFields) || !isValid}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

PaletteSelector.defaultProps = {
  trigger: (
    <div className="flex flex-col items-center space-y-8 w-128 m-8">
      <SectionPreview section="" />
      <Typography className="flex-1 text-16 font-bold mb-24">Edit Palette</Typography>
    </div>
  ),
};
export default PaletteSelector;
