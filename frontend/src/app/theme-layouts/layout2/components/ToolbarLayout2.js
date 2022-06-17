import { ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectFuseCurrentLayoutConfig, selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import AdjustFontSize from '../../shared-components/AdjustFontSize';
import FullScreenToggle from '../../shared-components/FullScreenToggle';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
import NotificationPanelToggleButton from '../../shared-components/notificationPanel/NotificationPanelToggleButton';
import NavigationShortcuts from '../../shared-components/NavigationShortcuts';
import NavigationSearch from '../../shared-components/NavigationSearch';
import NavbarToggleButton from '../../shared-components/NavbarToggleButton';
import UserMenu from '../../shared-components/UserMenu';
import QuickPanelToggleButton from '../../shared-components/quickPanel/QuickPanelToggleButton';
import ChatPanelToggleButton from '../../shared-components/chatPanel/ChatPanelToggleButton';

function ToolbarLayout2(props) {
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const toolbarTheme = useSelector(selectToolbarTheme);

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className={clsx('flex relative z-20 shadow-md', props.className)}
        color="default"
        style={{ backgroundColor: toolbarTheme.palette.background.paper }}
      >
        <Toolbar className="container p-0 lg:px-24 min-h-48 md:min-h-64">
          {config.navbar.display && (
            <Hidden lgUp>
              <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
            </Hidden>
          )}

          <div className="flex flex-1">
            <Hidden lgDown>
              <NavigationShortcuts />
            </Hidden>
          </div>

          <div className="flex items-center px-8 h-full overflow-x-auto">
            <LanguageSwitcher />

            <AdjustFontSize />

            <FullScreenToggle />

            <NavigationSearch />

            <Hidden lgUp>
              <ChatPanelToggleButton />
            </Hidden>

            <QuickPanelToggleButton />

            <NotificationPanelToggleButton />

            <UserMenu />
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(ToolbarLayout2);
