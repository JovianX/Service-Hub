import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';

import Tooltip from '@mui/material/Tooltip';
import { navbarToggle, navbarToggleMobile } from 'app/store/fuse/navbarSlice';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectFuseCurrentLayoutConfig } from 'app/store/fuse/settingsSlice';

const Root = styled(Tooltip)(({ theme, position }) => ({
  '& > .button': {
    height: 40,
    position: 'absolute',
    zIndex: 99,
    top: 12,
    width: 24,
    borderRadius: 38,
    padding: 8,
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(
      ['background-color', 'border-radius', 'width', 'min-width', 'padding'],
      {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
      }
    ),
    '&:hover': {
      width: 52,
      paddingLeft: 8,
      paddingRight: 8,
    },

    '& > .button-icon': {
      fontSize: 18,
      transition: theme.transitions.create(['transform'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.short,
      }),
    },

    ...(position === 'left' && {
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      paddingLeft: 4,
      left: 0,
    }),

    ...(position === 'right' && {
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      paddingRight: 4,
      right: 0,
      '& > .button-icon': {
        transform: 'rotate(-180deg)',
      },
    }),
  },
}));

function NavbarToggleFab(props) {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const config = useSelector(selectFuseCurrentLayoutConfig);

  const dispatch = useDispatch();

  return (
    <Root
      title="Show Navigation"
      placement={config.navbar.position === 'left' ? 'right' : 'left'}
      position={config.navbar.position}
    >
      <Fab
        className={clsx('button', props.className)}
        onClick={(ev) => dispatch(isMobile ? navbarToggleMobile() : navbarToggle())}
        disableRipple
      >
        <FuseSvgIcon color="action" className="button-icon">
          heroicons-outline:view-list
        </FuseSvgIcon>
      </Fab>
    </Root>
  );
}

NavbarToggleFab.defaultProps = {};

export default NavbarToggleFab;
