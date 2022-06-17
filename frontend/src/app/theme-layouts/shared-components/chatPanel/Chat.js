import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputBase from '@mui/material/InputBase';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectSelectedContactId } from './store/contactsSlice';
import { selectChat, sendMessage } from './store/chatSlice';
import { selectUser } from './store/userSlice';

const StyledMessageRow = styled('div')(({ theme }) => ({
  '&.contact': {
    '& .bubble': {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      '& .time': {
        marginLeft: 12,
      },
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopLeftRadius: 20,
      },
    },
    '&.last-of-group': {
      '& .bubble': {
        borderBottomLeftRadius: 20,
      },
    },
  },
  '&.me': {
    paddingLeft: 40,

    '& .bubble': {
      marginLeft: 'auto',
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      '& .time': {
        justifyContent: 'flex-end',
        right: 0,
        marginRight: 12,
      },
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopRightRadius: 20,
      },
    },

    '&.last-of-group': {
      '& .bubble': {
        borderBottomRightRadius: 20,
      },
    },
  },
  '&.contact + .me, &.me + .contact': {
    paddingTop: 20,
    marginTop: 20,
  },
  '&.first-of-group': {
    '& .bubble': {
      borderTopLeftRadius: 20,
      paddingTop: 13,
    },
  },
  '&.last-of-group': {
    '& .bubble': {
      borderBottomLeftRadius: 20,
      paddingBottom: 13,
      '& .time': {
        display: 'flex',
      },
    },
  },
}));

function Chat(props) {
  const dispatch = useDispatch();
  const selectedContactId = useSelector(selectSelectedContactId);
  const chat = useSelector(selectChat);
  const user = useSelector(selectUser);

  const chatScroll = useRef(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  function scrollToBottom() {
    if (!chatScroll.current) {
      return;
    }
    chatScroll.current.scrollTo({
      top: chatScroll.current.scrollHeight,
      behavior: 'smooth',
    });
  }

  const onInputChange = (ev) => {
    setMessageText(ev.target.value);
  };

  return (
    <Paper
      className={clsx('flex flex-col relative pb-64 shadow', props.className)}
      sx={{ background: (theme) => theme.palette.background.default }}
    >
      <FuseScrollbars
        ref={chatScroll}
        className="flex flex-1 flex-col overflow-y-auto overscroll-contain"
        option={{ suppressScrollX: true, wheelPropagation: false }}
      >
        <div className="flex flex-col pt-16">
          {useMemo(() => {
            function isFirstMessageOfGroup(item, i) {
              return i === 0 || (chat[i - 1] && chat[i - 1].contactId !== item.contactId);
            }

            function isLastMessageOfGroup(item, i) {
              return (
                i === chat.length - 1 || (chat[i + 1] && chat[i + 1].contactId !== item.contactId)
              );
            }

            return chat?.length > 0
              ? chat.map((item, i) => {
                  return (
                    <StyledMessageRow
                      key={i}
                      className={clsx(
                        'flex flex-col grow-0 shrink-0 items-start justify-end relative px-16 pb-4',
                        item.contactId === user.id ? 'me' : 'contact',
                        { 'first-of-group': isFirstMessageOfGroup(item, i) },
                        { 'last-of-group': isLastMessageOfGroup(item, i) },
                        i + 1 === chat.length && 'pb-72'
                      )}
                    >
                      <div className="bubble flex relative items-center justify-center p-12 max-w-full">
                        <div className="leading-tight whitespace-pre-wrap">{item.value}</div>
                        <Typography
                          className="time absolute hidden w-full text-11 mt-8 -mb-24 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap"
                          color="text.secondary"
                        >
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </Typography>
                      </div>
                    </StyledMessageRow>
                  );
                })
              : null;
          }, [chat, user?.id])}
        </div>

        {chat?.length === 0 && (
          <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 items-center justify-center">
              <FuseSvgIcon size={128} color="disabled">
                heroicons-outline:chat
              </FuseSvgIcon>
            </div>
            <Typography className="px-16 pb-24 text-center" color="text.secondary">
              Start a conversation by typing your message below.
            </Typography>
          </div>
        )}
      </FuseScrollbars>

      {useMemo(() => {
        const onMessageSubmit = (ev) => {
          ev.preventDefault();
          if (messageText === '') {
            return;
          }
          dispatch(
            sendMessage({
              messageText,
              chatId: chat.id,
              contactId: selectedContactId,
            })
          ).then(() => {
            setMessageText('');
          });
        };

        return (
          <>
            {chat && (
              <form
                onSubmit={onMessageSubmit}
                className="pb-16 px-8 absolute bottom-0 left-0 right-0"
              >
                <Paper className="rounded-24 flex items-center relative shadow">
                  <InputBase
                    autoFocus={false}
                    id="message-input"
                    className="flex flex-1 grow shrink-0 mx-16 ltr:mr-48 rtl:ml-48 my-8"
                    placeholder="Type your message"
                    onChange={onInputChange}
                    value={messageText}
                  />
                  <IconButton
                    className="absolute ltr:right-0 rtl:left-0 top-0"
                    type="submit"
                    size="large"
                  >
                    <FuseSvgIcon className="rotate-90" color="action">
                      heroicons-outline:paper-airplane
                    </FuseSvgIcon>
                  </IconButton>
                </Paper>
              </form>
            )}
          </>
        );
      }, [chat, dispatch, messageText, selectedContactId])}
    </Paper>
  );
}

export default Chat;
