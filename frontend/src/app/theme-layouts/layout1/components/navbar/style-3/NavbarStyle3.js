import Hidden from '@mui/material/Hidden';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { navbarCloseMobile, selectFuseNavbar } from 'app/store/fuse/navbarSlice';
import GlobalStyles from '@mui/material/GlobalStyles';
import { selectFuseCurrentLayoutConfig } from 'app/store/fuse/settingsSlice';
import NavbarStyle3Content from './NavbarStyle3Content';

const navbarWidth = 120;
const navbarWidthDense = 64;
const panelWidth = 280;

const StyledNavBar = styled('div')(({ theme, dense, open, folded, position }) => ({
  minWidth: navbarWidth,
  width: navbarWidth,
  maxWidth: navbarWidth,

  ...(dense && {
    minWidth: navbarWidthDense,
    width: navbarWidthDense,
    maxWidth: navbarWidthDense,

    ...(!open && {
      ...(position === 'left' && {
        marginLeft: -navbarWidthDense,
      }),

      ...(position === 'right' && {
        marginRight: -navbarWidthDense,
      }),
    }),
  }),

  ...(!folded && {
    minWidth: dense ? navbarWidthDense + panelWidth : navbarWidth + panelWidth,
    width: dense ? navbarWidthDense + panelWidth : navbarWidth + panelWidth,
    maxWidth: dense ? navbarWidthDense + panelWidth : navbarWidth + panelWidth,

    '& #fuse-navbar-panel': {
      opacity: '1!important',
      pointerEvents: 'initial!important',
    },

    ...(!open && {
      ...(position === 'left' && {
        marginLeft: -(dense ? navbarWidthDense + panelWidth : navbarWidth + panelWidth),
      }),

      ...(position === 'right' && {
        marginRight: -(dense ? navbarWidthDense + panelWidth : navbarWidth + panelWidth),
      }),
    }),
  }),

  ...(!open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(position === 'left' && {
      marginLeft: -(dense ? navbarWidthDense : navbarWidth),
    }),

    ...(position === 'right' && {
      marginRight: -(dense ? navbarWidthDense : navbarWidth),
    }),
  }),

  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledNavBarMobile = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    '& #fuse-navbar-side-panel': {
      minWidth: 'auto',
      wdith: 'auto',
    },
    '& #fuse-navbar-panel': {
      opacity: '1!important',
      pointerEvents: 'initial!important',
    },
  },
}));

function NavbarStyle3(props) {
  const dispatch = useDispatch();
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const navbar = useSelector(selectFuseNavbar);
  const { folded } = config.navbar;

  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          '& #fuse-navbar-side-panel': {
            width: props.dense ? navbarWidthDense : navbarWidth,
            minWidth: props.dense ? navbarWidthDense : navbarWidth,
            maxWidth: props.dense ? navbarWidthDense : navbarWidth,
          },
          '& #fuse-navbar-panel': {
            maxWidth: '100%',
            width: panelWidth,
            [theme.breakpoints.up('lg')]: {
              minWidth: panelWidth,
              maxWidth: 'initial',
            },
          },
        })}
      />
      <Hidden lgDown>
        <StyledNavBar
          open={navbar.open}
          dense={props.dense ? 1 : 0}
          folded={folded ? 1 : 0}
          position={config.navbar.position}
          className="flex-col flex-auto sticky top-0 h-screen shrink-0 z-20 shadow-5"
        >
          <NavbarStyle3Content dense={props.dense ? 1 : 0} folded={folded ? 1 : 0} />
        </StyledNavBar>
      </Hidden>
      <Hidden lgUp>
        <StyledNavBarMobile
          classes={{
            paper: 'flex-col flex-auto h-screen max-w-full w-auto overflow-hidden',
          }}
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
          <NavbarStyle3Content dense={props.dense ? 1 : 0} folded={folded ? 1 : 0} />
        </StyledNavBarMobile>
      </Hidden>
    </>
  );
}

export default NavbarStyle3;
