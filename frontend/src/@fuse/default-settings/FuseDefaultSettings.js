import { fuseDark } from '@fuse/colors';
import { lightBlue, red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import qs from 'qs';

const defaultTheme = {
  palette: {
    mode: 'light',
    text: {
      primary: 'rgb(17, 24, 39)',
      secondary: 'rgb(107, 114, 128)',
      disabled: 'rgb(149, 156, 169)',
    },
    common: {
      black: 'rgb(17, 24, 39)',
      white: 'rgb(255, 255, 255)',
    },
    primary: {
      light: '#bec1c5',
      main: '#252f3e',
      dark: '#0d121b',
      contrastDefaultColor: 'light',
    },
    secondary: {
      light: '#bdf2fa',
      main: '#22d3ee',
      dark: '#0cb7e2',
    },
    background: {
      paper: '#FFFFFF',
      default: '#f6f7f9',
    },
    error: {
      light: '#ffcdd2',
      main: '#f44336',
      dark: '#b71c1c',
    },
  },
};

/**
 * SETTINGS DEFAULTS
 */
export const defaultSettings = {
  customScrollbars: true,
  direction: 'ltr',
  theme: {
    main: defaultTheme,
    navbar: defaultTheme,
    toolbar: defaultTheme,
    footer: defaultTheme,
  },
};

export function getParsedQuerySettings() {
  const parsedQueryString = qs.parse(window.location.search, { ignoreQueryPrefix: true });

  if (parsedQueryString && parsedQueryString.defaultSettings) {
    return JSON.parse(parsedQueryString.defaultSettings);
  }
  return {};

  // Generating route params from settings
  /* const settings = qs.stringify({
        defaultSettings: JSON.stringify(defaultSettings, {strictNullHandling: true})
    });
    console.info(settings); */
}

/**
 * THEME DEFAULTS
 */
export const defaultThemeOptions = {
  typography: {
    fontFamily: ['Inter var', 'Roboto', '"Helvetica"', 'Arial', 'sans-serif'].join(','),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        enableColorOnDark: true,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'text',
        color: 'inherit',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          // lineHeight: 1,
        },
        sizeMedium: {
          borderRadius: 20,
          height: 40,
          minHeight: 40,
          maxHeight: 40,
        },
        sizeSmall: {
          borderRadius: '15px',
        },
        sizeLarge: {
          borderRadius: '28px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover, &:focus': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        color: 'secondary',
      },
      styleOverrides: {
        contained: {
          borderRadius: 18,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiSelect: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          minHeight: 40,
          lineHeight: 1,
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&:before, &:after': {
            display: 'none',
          },
        },
      },
    },
    MuiSlider: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiCheckbox: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiRadio: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiSwitch: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { color: 'text.secondary' },
          style: {
            color: 'text.secondary',
          },
        },
      ],
    },
  },
};

export const mustHaveThemeOptions = {
  typography: {
    htmlFontSize: 10,
    fontSize: 14,
    body1: {
      fontSize: '1.4rem',
    },
    body2: {
      fontSize: '1.4rem',
    },
  },
};

export const defaultThemes = {
  default: {
    palette: {
      mode: 'light',
      primary: fuseDark,
      secondary: {
        light: lightBlue[400],
        main: lightBlue[600],
        dark: lightBlue[700],
      },
      error: red,
    },
    status: {
      danger: 'orange',
    },
  },
  defaultDark: {
    palette: {
      mode: 'dark',
      primary: fuseDark,
      secondary: {
        light: lightBlue[400],
        main: lightBlue[600],
        dark: lightBlue[700],
      },
      error: red,
    },
    status: {
      danger: 'orange',
    },
  },
};

export function extendThemeWithMixins(obj) {
  const theme = createTheme(obj);
  return {
    border: (width = 1) => ({
      borderWidth: width,
      borderStyle: 'solid',
      borderColor: theme.palette.divider,
    }),
    borderLeft: (width = 1) => ({
      borderLeftWidth: width,
      borderStyle: 'solid',
      borderColor: theme.palette.divider,
    }),
    borderRight: (width = 1) => ({
      borderRightWidth: width,
      borderStyle: 'solid',
      borderColor: theme.palette.divider,
    }),
    borderTop: (width = 1) => ({
      borderTopWidth: width,
      borderStyle: 'solid',
      borderColor: theme.palette.divider,
    }),
    borderBottom: (width = 1) => ({
      borderBottomWidth: width,
      borderStyle: 'solid',
      borderColor: theme.palette.divider,
    }),
  };
}
