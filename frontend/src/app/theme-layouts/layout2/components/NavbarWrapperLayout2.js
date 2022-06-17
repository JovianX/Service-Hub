import Hidden from '@mui/material/Hidden';
import { styled, ThemeProvider } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { navbarCloseMobile, selectFuseNavbar } from 'app/store/fuse/navbarSlice';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectFuseCurrentLayoutConfig, selectNavbarTheme } from 'app/store/fuse/settingsSlice';
import NavbarLayout2 from './NavbarLayout2';
import NavbarMobileLayout2 from './NavbarMobileLayout2';
import NavbarToggleFab from '../../shared-components/NavbarToggleFab';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& > .MuiDrawer-paper': {
    height: '100%',
    flexDirection: 'column',
    flex: '1 1 auto',
    width: 280,
    minWidth: 280,
    transition: theme.transitions.create(['width', 'min-width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

function NavbarWrapperLayout2(props) {
  const dispatch = useDispatch();
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const navbarTheme = useSelector(selectNavbarTheme);
  const navbar = useSelector(selectFuseNavbar);

  return (
    <>
      <ThemeProvider theme={navbarTheme}>
        <Hidden lgDown>
          <NavbarLayout2 />
        </Hidden>

        <Hidden lgUp>
          <StyledSwipeableDrawer
            anchor="left"
            variant="temporary"
            open={navbar.mobileOpen}
            onClose={() => dispatch(navbarCloseMobile())}
            onOpen={() => {}}
            disableSwipeToOpen
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <NavbarMobileLayout2 />
          </StyledSwipeableDrawer>
        </Hidden>
      </ThemeProvider>
      {config.navbar.display && !config.toolbar.display && (
        <Hidden lgUp>
          <NavbarToggleFab />
        </Hidden>
      )}
    </>
  );
}

export default memo(NavbarWrapperLayout2);
