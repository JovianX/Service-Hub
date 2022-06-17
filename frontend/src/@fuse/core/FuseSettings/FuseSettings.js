import { useDebounce, usePrevious } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import themeLayoutConfigs from 'app/theme-layouts/themeLayoutConfigs';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFuseCurrentSettings,
  selectFuseThemesSettings,
  setDefaultSettings,
} from 'app/store/fuse/settingsSlice';
import { selectUser } from 'app/store/userSlice';
import PaletteSelector from './palette-generator/PaletteSelector';
import SectionPreview from './palette-generator/SectionPreview';

const Root = styled('div')(({ theme }) => ({
  '& .FuseSettings-formControl': {
    margin: '6px 0',
    width: '100%',
    '&:last-child': {
      marginBottom: 0,
    },
  },

  '& .FuseSettings-group': {},

  '& .FuseSettings-formGroupTitle': {
    position: 'absolute',
    top: -10,
    left: 8,
    fontWeight: 600,
    padding: '0 4px',
    backgroundColor: theme.palette.background.paper,
  },

  '& .FuseSettings-formGroup': {
    position: 'relative',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    padding: '12px 12px 0 12px',
    margin: '24px 0 16px 0',
    '&:first-of-type': {
      marginTop: 16,
    },
  },
}));

function FuseSettings(props) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const themes = useSelector(selectFuseThemesSettings);
  const settings = useSelector(selectFuseCurrentSettings);
  const { reset, watch, control } = useForm({
    mode: 'onChange',
    defaultValues: settings,
  });
  const form = watch();
  const { form: formConfigs } = themeLayoutConfigs[form.layout.style];
  const prevForm = usePrevious(form ? _.merge({}, form) : null);
  const prevSettings = usePrevious(settings ? _.merge({}, settings) : null);
  const formChanged = !_.isEqual(form, prevForm);
  const settingsChanged = !_.isEqual(settings, prevSettings);

  const handleUpdate = useDebounce((newSettings) => {
    dispatch(setDefaultSettings(newSettings));
  }, 300);

  useEffect(() => {
    // Skip inital changes
    if (!prevForm && !prevSettings) {
      return;
    }

    // If theme settings changed update form data
    if (settingsChanged) {
      reset(settings);
      return;
    }

    const newSettings = _.merge({}, settings, form);

    // No need to change
    if (_.isEqual(newSettings, settings)) {
      return;
    }

    // If form changed update theme settings
    if (formChanged) {
      if (settings.layout.style !== newSettings.layout.style) {
        _.set(
          newSettings,
          'layout.config',
          themeLayoutConfigs[newSettings?.layout?.style]?.defaults
        );
      }
      handleUpdate(newSettings);
    }
  }, [
    dispatch,
    form,
    formChanged,
    handleUpdate,
    prevForm,
    prevSettings,
    reset,
    settings,
    settingsChanged,
    user,
  ]);

  const ThemeSelect = ({ value, name, handleThemeChange }) => {
    return (
      <Select
        className="w-full rounded-8 h-40 overflow-hidden my-8"
        value={value}
        onChange={handleThemeChange}
        name={name}
        variant="outlined"
        style={{
          backgroundColor: themes[value].palette.background.default,
          color: themes[value].palette.mode === 'light' ? '#000000' : '#ffffff',
        }}
      >
        {Object.entries(themes)
          .filter(
            ([key, val]) =>
              !(name === 'theme.main' && (key === 'mainThemeDark' || key === 'mainThemeLight'))
          )
          .map(([key, val]) => (
            <MenuItem
              key={key}
              value={key}
              className="m-8 mt-0 rounded-lg"
              style={{
                backgroundColor: val.palette.background.default,
                color: val.palette.mode === 'light' ? '#000000' : '#FFFFFF',
                border: `1px solid ${
                  val.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'
                }`,
              }}
            >
              {_.startCase(key)}
              <div
                className="flex w-full h-8 block absolute bottom-0 left-0 right-0"
                style={{
                  borderTop: `1px solid ${
                    val.palette.mode === 'light'
                      ? 'rgba(0, 0, 0, 0.12)'
                      : 'rgba(255, 255, 255, 0.12)'
                  }`,
                }}
              >
                <div
                  className="w-1/4 h-8"
                  style={{
                    backgroundColor: val.palette.primary.main
                      ? val.palette.primary.main
                      : val.palette.primary[500],
                  }}
                />
                <div
                  className="w-1/4 h-8"
                  style={{
                    backgroundColor: val.palette.secondary.main
                      ? val.palette.secondary.main
                      : val.palette.secondary[500],
                  }}
                />
                <div
                  className="w-1/4 h-8"
                  style={{
                    backgroundColor: val.palette.error.main
                      ? val.palette.error.main
                      : val.palette.error[500],
                  }}
                />
                <div
                  className="w-1/4 h-8"
                  style={{ backgroundColor: val.palette.background.paper }}
                />
              </div>
            </MenuItem>
          ))}
      </Select>
    );
  };

  const getForm = useCallback(
    (_formConfigs, prefix) =>
      Object.entries(_formConfigs).map(([key, formControl]) => {
        const target = prefix ? `${prefix}.${key}` : key;
        switch (formControl.type) {
          case 'radio': {
            return (
              <Controller
                key={target}
                name={target}
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" className="FuseSettings-formControl">
                    <FormLabel component="legend" className="text-14">
                      {formControl.title}
                    </FormLabel>
                    <RadioGroup
                      {...field}
                      aria-label={formControl.title}
                      className="FuseSettings-group"
                      row={formControl.options.length < 4}
                    >
                      {formControl.options.map((opt) => (
                        <FormControlLabel
                          key={opt.value}
                          value={opt.value}
                          control={<Radio />}
                          label={opt.name}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
            );
          }
          case 'switch': {
            return (
              <Controller
                key={target}
                name={target}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControl component="fieldset" className="FuseSettings-formControl">
                    <FormLabel component="legend" className="text-14">
                      {formControl.title}
                    </FormLabel>
                    <Switch
                      checked={value}
                      onChange={(ev) => onChange(ev.target.checked)}
                      aria-label={formControl.title}
                    />
                  </FormControl>
                )}
              />
            );
          }
          case 'number': {
            return (
              <div key={target} className="FuseSettings-formControl">
                <Controller
                  name={target}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={formControl.title}
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                    />
                  )}
                />
              </div>
            );
          }
          case 'group': {
            return (
              <div key={target} className="FuseSettings-formGroup">
                <Typography className="FuseSettings-formGroupTitle" color="text.secondary">
                  {formControl.title}
                </Typography>

                {getForm(formControl.children, target)}
              </div>
            );
          }
          default: {
            return '';
          }
        }
      }),
    [control]
  );

  return (
    <Root>
      <div className="FuseSettings-formGroup">
        <Typography className="FuseSettings-formGroupTitle" color="text.secondary">
          Layout
        </Typography>

        <Controller
          name="layout.style"
          control={control}
          render={({ field }) => (
            <FormControl component="fieldset" className="FuseSettings-formControl">
              <FormLabel component="legend" className="text-14">
                Style
              </FormLabel>
              <RadioGroup {...field} aria-label="Layout Style" className="FuseSettings-group">
                {Object.entries(themeLayoutConfigs).map(([key, layout]) => (
                  <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio />}
                    label={layout.title}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
        />

        {useMemo(() => getForm(formConfigs, 'layout.config'), [formConfigs, getForm])}

        <Typography className="my-16 text-12 italic" color="text.secondary">
          *Not all option combinations are available
        </Typography>
      </div>

      <div className="FuseSettings-formGroup pb-16">
        <Typography className="FuseSettings-formGroupTitle" color="text.secondary">
          Theme
        </Typography>

        <div className="flex flex-wrap -mx-8">
          <Controller
            name="theme.main"
            control={control}
            render={({ field: { value, onChange } }) => (
              <PaletteSelector
                value={value}
                onChange={onChange}
                trigger={
                  <div className="flex flex-col items-center space-y-8 w-128 m-8 cursor-pointer group">
                    <SectionPreview
                      className="group-hover:shadow-lg transition-shadow"
                      section="main"
                    />
                    <Typography className="flex-1 text-14 font-semibold mb-24 opacity-80 group-hover:opacity-100">
                      Main Palette
                    </Typography>
                  </div>
                }
              />
            )}
          />

          <Controller
            name="theme.navbar"
            control={control}
            render={({ field: { value, onChange } }) => (
              <PaletteSelector
                value={value}
                onChange={onChange}
                trigger={
                  <div className="flex flex-col items-center space-y-8 w-128 m-8 cursor-pointer group">
                    <SectionPreview
                      className="group-hover:shadow-lg transition-shadow"
                      section="navbar"
                    />
                    <Typography className="flex-1 text-14 font-semibold mb-24 opacity-80 group-hover:opacity-100">
                      Navbar Palette
                    </Typography>
                  </div>
                }
              />
            )}
          />

          <Controller
            name="theme.toolbar"
            control={control}
            render={({ field: { value, onChange } }) => (
              <PaletteSelector
                value={value}
                onChange={onChange}
                trigger={
                  <div className="flex flex-col items-center space-y-8 w-128 m-8 cursor-pointer group">
                    <SectionPreview
                      className="group-hover:shadow-lg transition-shadow"
                      section="toolbar"
                    />
                    <Typography className="flex-1 text-14 font-semibold mb-24 opacity-80 group-hover:opacity-100">
                      Toolbar Palette
                    </Typography>
                  </div>
                }
              />
            )}
          />

          <Controller
            name="theme.footer"
            control={control}
            render={({ field: { value, onChange } }) => (
              <PaletteSelector
                value={value}
                onChange={onChange}
                trigger={
                  <div className="flex flex-col items-center space-y-8 w-128 m-8 cursor-pointer group">
                    <SectionPreview
                      className="group-hover:shadow-lg transition-shadow"
                      section="footer"
                    />
                    <Typography className="flex-1 text-14 font-semibold mb-24 opacity-80 group-hover:opacity-100">
                      Footer Palette
                    </Typography>
                  </div>
                }
              />
            )}
          />
        </div>
      </div>

      <Controller
        name="customScrollbars"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControl component="fieldset" className="FuseSettings-formControl">
            <FormLabel component="legend" className="text-14">
              Custom Scrollbars
            </FormLabel>
            <Switch
              checked={value}
              onChange={(ev) => onChange(ev.target.checked)}
              aria-label="Custom Scrollbars"
            />
          </FormControl>
        )}
      />

      <Controller
        name="direction"
        control={control}
        render={({ field }) => (
          <FormControl component="fieldset" className="FuseSettings-formControl">
            <FormLabel component="legend" className="text-14">
              Direction
            </FormLabel>
            <RadioGroup {...field} aria-label="Layout Direction" className="FuseSettings-group" row>
              <FormControlLabel key="rtl" value="rtl" control={<Radio />} label="RTL" />
              <FormControlLabel key="ltr" value="ltr" control={<Radio />} label="LTR" />
            </RadioGroup>
          </FormControl>
        )}
      />
    </Root>
  );
}

export default memo(FuseSettings);
