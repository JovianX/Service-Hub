import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { styled, useTheme } from '@mui/material/styles';
import { useDebounce } from '@fuse/hooks';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { Manager, Popper, Reference } from 'react-popper';
import withRouter from '@fuse/core/withRouter';
import FuseNavItem from '../../FuseNavItem';
import FuseSvgIcon from '../../../FuseSvgIcon';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&.active, &.active:hover, &.active:focus': {
    backgroundColor: `${theme.palette.secondary.main}!important`,
    color: `${theme.palette.secondary.contrastText}!important`,
    '& .fuse-list-item-text-primary': {
      color: 'inherit',
    },
    '& .fuse-list-item-icon': {
      color: 'inherit',
    },
  },
  '& .fuse-list-item-text': {
    padding: '0 0 0 16px',
  },
  '&.level-0': {
    minHeight: 44,
    borderRadius: 4,
    '&:hover': {
      background: 'transparent',
    },
  },
}));

function isUrlInChildren(parent, url) {
  if (!parent.children) {
    return false;
  }

  for (let i = 0; i < parent.children.length; i += 1) {
    if (parent.children[i].children) {
      if (isUrlInChildren(parent.children[i], url)) {
        return true;
      }
    }

    if (parent.children[i].url === url || url.includes(parent.children[i].url)) {
      return true;
    }
  }

  return false;
}

function FuseNavHorizontalGroup(props) {
  const [opened, setOpened] = useState(false);
  const { item, nestedLevel, dense } = props;
  const theme = useTheme();

  const handleToggle = useDebounce((open) => {
    setOpened(open);
  }, 150);

  return useMemo(() => {
    let popperPlacement = 'left';

    if (nestedLevel === 0) {
      popperPlacement = theme.direction === 'ltr' ? 'bottom-start' : 'bottom-end';
    } else {
      popperPlacement = theme.direction === 'ltr' ? 'right' : 'left';
    }

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <div ref={ref}>
              <StyledListItem
                button
                className={clsx(
                  'fuse-list-item',
                  'relative',
                  `level-${nestedLevel}`,
                  isUrlInChildren(item, props.location.pathname) && 'active'
                )}
                onMouseEnter={() => handleToggle(true)}
                onMouseLeave={() => handleToggle(false)}
                aria-owns={opened ? 'menu-fuse-list-grow' : null}
                aria-haspopup="true"
                component={item.url ? NavLinkAdapter : 'li'}
                to={item.url}
                end={item.end}
                role="button"
                sx={item.sx}
                disabled={item.disabled}
              >
                {item.icon && (
                  <FuseSvgIcon
                    color="action"
                    className={clsx('fuse-list-item-icon shrink-0', item.iconClass)}
                  >
                    {item.icon}
                  </FuseSvgIcon>
                )}

                <ListItemText
                  className="fuse-list-item-text"
                  primary={item.title}
                  classes={{ primary: 'text-13 truncate' }}
                />

                {nestedLevel > 0 && (
                  <IconButton
                    disableRipple
                    className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0"
                    color="inherit"
                    size="large"
                  >
                    <FuseSvgIcon size={16} className="arrow-icon">
                      {theme.direction === 'ltr'
                        ? 'heroicons-outline:arrow-sm-right'
                        : 'heroicons-outline:arrow-sm-left'}
                    </FuseSvgIcon>
                  </IconButton>
                )}
              </StyledListItem>
            </div>
          )}
        </Reference>
        {ReactDOM.createPortal(
          <Popper placement={popperPlacement} eventsEnabled={opened} positionFixed>
            {({ ref, style, placement, arrowProps }) =>
              opened && (
                <div
                  ref={ref}
                  style={{
                    ...style,
                    zIndex: 999 + nestedLevel,
                  }}
                  data-placement={placement}
                  className={clsx('z-999', !opened && 'pointer-events-none')}
                >
                  <Grow in={opened} id="menu-fuse-list-grow" style={{ transformOrigin: '0 0 0' }}>
                    <Paper
                      className="rounded-8"
                      onMouseEnter={() => handleToggle(true)}
                      onMouseLeave={() => handleToggle(false)}
                    >
                      {item.children && (
                        <ul className={clsx('popper-navigation-list', dense && 'dense', 'px-0')}>
                          {item.children.map((_item) => (
                            <FuseNavItem
                              key={_item.id}
                              type={`horizontal-${_item.type}`}
                              item={_item}
                              nestedLevel={nestedLevel}
                              dense={dense}
                            />
                          ))}
                        </ul>
                      )}
                    </Paper>
                  </Grow>
                </div>
              )
            }
          </Popper>,
          document.querySelector('#root')
        )}
      </Manager>
    );
  }, [dense, handleToggle, item, nestedLevel, opened, props.location.pathname, theme.direction]);
}

FuseNavHorizontalGroup.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    children: PropTypes.array,
  }),
};

FuseNavHorizontalGroup.defaultProps = {};

const NavHorizontalGroup = withRouter(memo(FuseNavHorizontalGroup));

export default NavHorizontalGroup;
