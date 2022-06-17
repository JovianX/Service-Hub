import Hidden from '@mui/material/Hidden';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import {
  navbarCloseFolded,
  navbarCloseMobile,
  navbarOpenFolded,
  selectFuseNavbar,
} from 'app/store/fuse/navbarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectFuseCurrentLayoutConfig } from 'app/store/fuse/settingsSlice';
import NavbarStyle2Content from './NavbarStyle2Content';

const navbarWidth = 280;

const Root = styled('div')(({ theme, folded }) => ({
  display: 'flex',
  flexDirection: 'column',
  zIndex: 4,
  [theme.breakpoints.up('lg')]: {
    width: navbarWidth,
    minWidth: navbarWidth,
  },

  ...(folded && {
    [theme.breakpoints.up('lg')]: {
      width: 76,
      minWidth: 76,
    },
  }),
}));

const StyledNavbar = styled('div')(
  ({ theme, position, folded, foldedandopened, foldedandclosed }) => ({
    minWidth: navbarWidth,
    width: navbarWidth,
    maxWidth: navbarWidth,
    maxHeight: '100%',
    transition: theme.transitions.create(['width', 'min-width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),

    ...(position === 'left' && {
      left: 0,
    }),

    ...(position === 'right' && {
      right: 0,
    }),

    ...(folded && {
      position: 'absolute',
      width: 76,
      minWidth: 76,
      top: 0,
      bottom: 0,
    }),

    ...(foldedandopened && {
      width: navbarWidth,
      minWidth: navbarWidth,
    }),

    ...(foldedandclosed && {
      '& .NavbarStyle2-content': {
        '& .logo-icon': {
          width: 44,
          height: 44,
        },
        '& .logo-text': {
          opacity: 0,
        },
        '& .react-badge': {
          opacity: 0,
        },
        '& .fuse-list-item': {
          width: 56,
        },
        '& .fuse-list-item-text, & .arrow-icon, & .item-badge': {
          opacity: 0,
        },
        '& .fuse-list-subheader .fuse-list-subheader-text': {
          opacity: 0,
        },
        '& .fuse-list-subheader:before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          minWidth: 16,
          borderTop: '2px solid',
          opacity: 0.2,
        },
        '& .collapse-children': {
          display: 'none',
        },
      },
    }),
  })
);

const StyledNavbarMobile = styled(SwipeableDrawer)(({ theme, position }) => ({
  '& > .MuiDrawer-paper': {
    minWidth: navbarWidth,
    width: navbarWidth,
    maxWidth: navbarWidth,
    maxHeight: '100%',
    transition: theme.transitions.create(['width', 'min-width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

function NavbarStyle2(props) {
  const dispatch = useDispatch();
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const navbar = useSelector(selectFuseNavbar);

  // const folded = !navbar.open;
  const { folded } = config.navbar;
  const foldedandclosed = folded && !navbar.foldedOpen;
  const foldedandopened = folded && navbar.foldedOpen;

  return (
    <Root
      folded={folded ? 1 : 0}
      open={navbar.open}
      id="fuse-navbar"
      className="sticky top-0 h-screen shrink-0 z-20 shadow-5"
    >
      <Hidden lgDown>
        <StyledNavbar
          className="flex-col flex-auto"
          position={config.navbar.position}
          folded={folded ? 1 : 0}
          foldedandopened={foldedandopened ? 1 : 0}
          foldedandclosed={foldedandclosed ? 1 : 0}
          onMouseEnter={() => foldedandclosed && dispatch(navbarOpenFolded())}
          onMouseLeave={() => foldedandopened && dispatch(navbarCloseFolded())}
        >
          <NavbarStyle2Content className="NavbarStyle2-content" />
        </StyledNavbar>
      </Hidden>

      <Hidden lgUp>
        <StyledNavbarMobile
          classes={{
            paper: 'flex-col flex-auto h-full',
          }}
          folded={folded ? 1 : 0}
          foldedandopened={foldedandopened ? 1 : 0}
          foldedandclosed={foldedandclosed ? 1 : 0}
          anchor={config.navbar.position}
          variant="temporary"
          open={navbar.mobileOpen}
          onClose={() => dispatch(navbarCloseMobile())}
          onOpen={() => {}}
          disableSwipeToOpen
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <NavbarStyle2Content className="NavbarStyle2-content" />
        </StyledNavbarMobile>
      </Hidden>
    </Root>
  );
}

export default NavbarStyle2;
