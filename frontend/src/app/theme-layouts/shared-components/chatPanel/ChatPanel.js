import AppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import keycode from 'keycode';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Chat from './Chat';
import ContactList from './ContactList';
import reducer from './store';
import { getContacts, selectContacts, selectSelectedContactId } from './store/contactsSlice';
import { closeChatPanel, openChatPanel, selectChatPanelState } from './store/stateSlice';
import { getUserData } from './store/userSlice';
import { getChats } from './store/chatsSlice';

const Root = styled('div')(({ theme, opened }) => ({
  position: 'sticky',
  display: 'flex',
  top: 0,
  width: 70,
  maxWidth: 70,
  minWidth: 70,
  height: '100vh',
  zIndex: 1000,

  [theme.breakpoints.down('lg')]: {
    position: 'fixed',
    height: '100%',
    width: 0,
    maxWidth: 0,
    minWidth: 0,
  },

  ...(opened && {
    overflow: 'visible',
  }),

  ...(!opened && {
    overflow: 'hidden',
    animation: `hide-panel 1ms linear ${theme.transitions.duration.standard}`,
    animationFillMode: 'forwards',
  }),

  '& > .panel': {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 360,
    minWidth: 360,
    height: '100%',
    margin: 0,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transform: 'translate3d(0,0,0)',
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.standard,
    }),

    ...(opened && {
      transform: theme.direction === 'rtl' ? 'translate3d(290px,0,0)' : 'translate3d(-290px,0,0)',
    }),

    [theme.breakpoints.down('lg')]: {
      left: 'auto',
      position: 'fixed',
      transform: theme.direction === 'rtl' ? 'translate3d(-360px,0,0)' : 'translate3d(360px,0,0)',
      boxShadow: 'none',
      width: 320,
      minWidth: 320,
      maxWidth: '100%',

      ...(opened && {
        transform: 'translate3d(0,0,0)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }),
    },
  },

  '@keyframes hide-panel': {
    '0%': {
      overflow: 'visible',
    },
    '99%': {
      overflow: 'visible',
    },
    '100%': {
      overflow: 'hidden',
    },
  },
}));

function ChatPanel(props) {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const selectedContactId = useSelector(selectSelectedContactId);
  const state = useSelector(selectChatPanelState);
  const theme = useTheme();

  const ref = useRef();
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      return state && theme.direction === 'rtl' && dispatch(closeChatPanel());
    },
    onSwipedRight: () => {
      return state && theme.direction === 'ltr' && dispatch(closeChatPanel());
    },
  });

  const selectedContact = contacts.find((_contact) => _contact.id === selectedContactId);

  const handleDocumentKeyDown = useCallback(
    (event) => {
      if (keycode(event) === 'esc') {
        dispatch(closeChatPanel());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(getUserData());
    dispatch(getContacts());
    dispatch(getChats());
    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [dispatch, handleDocumentKeyDown]);

  useEffect(() => {
    if (state) {
      document.addEventListener('keydown', handleDocumentKeyDown);
    } else {
      document.removeEventListener('keydown', handleDocumentKeyDown);
    }
  }, [handleDocumentKeyDown, state]);

  /**
   * Click Away Listener
   */
  useEffect(() => {
    function handleDocumentClick(ev) {
      if (ref.current && !ref.current.contains(ev.target)) {
        dispatch(closeChatPanel());
      }
    }

    if (state) {
      document.addEventListener('click', handleDocumentClick, true);
    } else {
      document.removeEventListener('click', handleDocumentClick, true);
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [state, dispatch]);

  return (
    <Root opened={state ? 1 : 0} {...handlers}>
      <div className="panel flex flex-col max-w-full" ref={ref}>
        <AppBar position="static" className="shadow-md">
          <Toolbar className="px-4">
            {(!state || !selectedContactId) && (
              <div className="flex flex-1 items-center px-8 space-x-12">
                <IconButton
                  className=""
                  color="inherit"
                  onClick={(ev) => dispatch(openChatPanel())}
                  size="large"
                >
                  <FuseSvgIcon size={24}>heroicons-outline:chat-alt-2</FuseSvgIcon>
                </IconButton>
                {!selectedContactId && (
                  <Typography className="text-16" color="inherit">
                    Team Chat
                  </Typography>
                )}
              </div>
            )}
            {state && selectedContact && (
              <div className="flex flex-1 items-center px-12">
                <Avatar src={selectedContact.avatar} />
                <Typography className="mx-16 text-16" color="inherit">
                  {selectedContact.name}
                </Typography>
              </div>
            )}
            <div className="flex px-4">
              <IconButton onClick={(ev) => dispatch(closeChatPanel())} color="inherit" size="large">
                <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Paper className="flex flex-1 flex-row min-h-px shadow-0">
          <ContactList className="flex shrink-0" />

          {state && selectedContact ? (
            <Chat className="flex flex-1 z-10" />
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center p-24">
              <FuseSvgIcon size={128} color="disabled">
                heroicons-outline:chat
              </FuseSvgIcon>
              <Typography className="px-16 pb-24 mt-24 text-center" color="text.secondary">
                Select a contact to start a conversation.
              </Typography>
            </div>
          )}
        </Paper>
      </div>
    </Root>
  );
}

export default withReducer('chatPanel', reducer)(memo(ChatPanel));
