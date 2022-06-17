import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled, useTheme } from '@mui/material/styles';
import FuseSettings from '@fuse/core/FuseSettings';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import { forwardRef, memo, useState } from 'react';
import FuseThemeSchemes from '@fuse/core/FuseThemeSchemes';
import { useSwipeable } from 'react-swipeable';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import themesConfig from 'app/configs/themesConfig';
import { changeFuseTheme } from 'app/store/fuse/settingsSlice';
import { useDispatch } from 'react-redux';
import FuseSettingsViewerDialog from './FuseSettingsViewerDialog';

const Root = styled('div')(({ theme }) => ({
  position: 'absolute',
  height: 80,
  right: 0,
  top: 160,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: 0,
  borderTopLeftRadius: 6,
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 0,
  borderTopRightRadius: 0,
  zIndex: 999,
  color: theme.palette.getContrastText(red[500]),
  backgroundColor: red[400],
  '&:hover': {
    backgroundColor: red[500],
  },

  '& .settingsButton': {
    '& > span': {
      animation: 'rotating 3s linear infinite',
    },
  },

  '@keyframes rotating': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    position: 'fixed',
    width: 380,
    maxWidth: '90vw',
    backgroundColor: theme.palette.background.paper,
    top: 0,
    height: '100%',
    minHeight: '100%',
    bottom: 0,
    right: 0,
    margin: 0,
    zIndex: 1000,
    borderRadius: 0,
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  const theme = useTheme();
  return <Slide direction={theme.direction === 'ltr' ? 'left' : 'right'} ref={ref} {...props} />;
});

function SettingsPanel() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handlerOptions = {
    onSwipedLeft: () => {
      return open && theme.direction === 'rtl' && handleClose();
    },
    onSwipedRight: () => {
      return open && theme.direction === 'ltr' && handleClose();
    },
  };

  const settingsHandlers = useSwipeable(handlerOptions);
  const shemesHandlers = useSwipeable(handlerOptions);

  const handleOpen = (panelId) => {
    setOpen(panelId);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Root id="fuse-settings-schemes" className="buttonWrapper">
        <Button
          className="settingsButton min-w-40 w-40 h-40 m-0"
          onClick={() => handleOpen('settings')}
          variant="text"
          color="inherit"
          disableRipple
        >
          <span>
            <FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>
          </span>
        </Button>

        <Button
          className="min-w-40 w-40 h-40 m-0"
          onClick={() => handleOpen('schemes')}
          variant="text"
          color="inherit"
          disableRipple
        >
          <FuseSvgIcon size={20}>heroicons-outline:color-swatch</FuseSvgIcon>
        </Button>
      </Root>
      <StyledDialog
        TransitionComponent={Transition}
        aria-labelledby="settings-panel"
        aria-describedby="settings"
        open={open === 'settings'}
        onClose={handleClose}
        BackdropProps={{ invisible: true }}
        classes={{
          paper: 'shadow-lg',
        }}
        {...settingsHandlers}
      >
        <FuseScrollbars className="p-16 sm:p-32">
          <IconButton
            className="fixed top-0 ltr:right-0 rtl:left-0 z-10"
            onClick={handleClose}
            size="large"
          >
            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
          </IconButton>

          <Typography className="mb-32 font-semibold" variant="h6">
            Theme Settings
          </Typography>

          <FuseSettings />

          <FuseSettingsViewerDialog className="mt-32" />
        </FuseScrollbars>
      </StyledDialog>
      <StyledDialog
        TransitionComponent={Transition}
        aria-labelledby="schemes-panel"
        aria-describedby="schemes"
        open={open === 'schemes'}
        onClose={handleClose}
        BackdropProps={{ invisible: true }}
        classes={{
          paper: 'shadow-lg',
        }}
        {...shemesHandlers}
      >
        <FuseScrollbars className="p-16 sm:p-32">
          <IconButton
            className="fixed top-0 ltr:right-0 rtl:left-0 z-10"
            onClick={handleClose}
            size="large"
          >
            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
          </IconButton>

          <Typography className="mb-32" variant="h6">
            Theme Color Schemes
          </Typography>

          <Typography className="mb-24 text-12 italic text-justify" color="text.secondary">
            * Selected color scheme will be applied to all theme layout elements (navbar, toolbar,
            etc.). You can also select a different color scheme for each layout element at theme
            settings.
          </Typography>

          <FuseThemeSchemes
            themes={themesConfig}
            onSelect={(_theme) => {
              dispatch(changeFuseTheme(_theme));
            }}
          />
        </FuseScrollbars>
      </StyledDialog>
    </>
  );
}

export default memo(SettingsPanel);
