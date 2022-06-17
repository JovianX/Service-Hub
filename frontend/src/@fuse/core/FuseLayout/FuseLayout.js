import { useDeepCompareEffect } from '@fuse/hooks';
import _ from '@lodash';
import AppContext from 'app/AppContext';
import {
  generateSettings,
  selectFuseCurrentSettings,
  selectFuseDefaultSettings,
  setSettings,
} from 'app/store/fuse/settingsSlice';
import { memo, useCallback, useContext, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { matchRoutes, useLocation } from 'react-router-dom';
import GlobalStyles from '@mui/material/GlobalStyles';
import { alpha } from '@mui/material/styles';

const inputGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      html: {
        backgroundColor: `${theme.palette.background.default}!important`,
        color: `${theme.palette.text.primary}!important`,
      },
      body: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
      /*  'code:not([class*="language-"])': {
        color: theme.palette.secondary.dark,
        backgroundColor:
          theme.palette.mode === 'light' ? 'rgba(255, 255, 255, .9)' : 'rgba(0, 0, 0, .9)',
        padding: '2px 3px',
        borderRadius: 2,
        lineHeight: 1.7,
      }, */
      'table.simple tbody tr td': {
        borderColor: theme.palette.divider,
      },
      'table.simple thead tr th': {
        borderColor: theme.palette.divider,
      },
      'a:not([role=button]):not(.MuiButtonBase-root)': {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
        '&:hover': {},
      },
      'a.link, a:not([role=button])[target=_blank]': {
        background: alpha(theme.palette.secondary.main, 0.2),
        color: 'inherit',
        borderBottom: `1px solid ${theme.palette.divider}`,
        textDecoration: 'none',
        '&:hover': {
          background: alpha(theme.palette.secondary.main, 0.3),
          textDecoration: 'none',
        },
      },
      '[class^="border"]': {
        borderColor: theme.palette.divider,
      },
      '[class*="border"]': {
        borderColor: theme.palette.divider,
      },
      '[class*="divide-"] > :not([hidden]) ~ :not([hidden])': {
        borderColor: theme.palette.divider,
      },
      hr: {
        borderColor: theme.palette.divider,
      },

      '::-webkit-scrollbar-thumb': {
        boxShadow: `inset 0 0 0 20px ${
          theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
        }`,
      },
      '::-webkit-scrollbar-thumb:active': {
        boxShadow: `inset 0 0 0 20px ${
          theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
        }`,
      },
    })}
  />
);

function FuseLayout(props) {
  const { layouts } = props;
  const dispatch = useDispatch();
  const settings = useSelector(selectFuseCurrentSettings);
  const defaultSettings = useSelector(selectFuseDefaultSettings);

  const appContext = useContext(AppContext);
  const { routes } = appContext;

  const location = useLocation();
  const { pathname } = location;

  const matchedRoutes = matchRoutes(routes, pathname);
  const matched = matchedRoutes ? matchedRoutes[0] : false;

  const newSettings = useRef(null);

  const shouldAwaitRender = useCallback(() => {
    let _newSettings;
    /**
     * On Path changed
     */
    // if (prevPathname !== pathname) {
    if (matched && matched.route.settings) {
      /**
       * if matched route has settings
       */

      const routeSettings = matched.route.settings;

      _newSettings = generateSettings(defaultSettings, routeSettings);
    } else if (!_.isEqual(newSettings.current, defaultSettings)) {
      /**
       * Reset to default settings on the new path
       */
      _newSettings = _.merge({}, defaultSettings);
    } else {
      _newSettings = newSettings.current;
    }

    if (!_.isEqual(newSettings.current, _newSettings)) {
      newSettings.current = _newSettings;
    }
  }, [defaultSettings, matched]);

  shouldAwaitRender();

  useDeepCompareEffect(() => {
    if (!_.isEqual(newSettings.current, settings)) {
      dispatch(setSettings(newSettings.current));
    }
  }, [dispatch, newSettings.current, settings]);

  // console.warn('::FuseLayout:: rendered');

  const Layout = useMemo(() => layouts[settings.layout.style], [layouts, settings.layout.style]);

  return _.isEqual(newSettings.current, settings) ? (
    <>
      {inputGlobalStyles}
      <Layout {...props} />
    </>
  ) : null;
}

export default memo(FuseLayout);
