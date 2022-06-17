import IconButton from '@mui/material/IconButton';
import { useDispatch } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { toggleChatPanel } from './store/stateSlice';

const ChatPanelToggleButton = (props) => {
  const dispatch = useDispatch();

  return (
    <IconButton className="w-40 h-40" onClick={(ev) => dispatch(toggleChatPanel())} size="large">
      {props.children}
    </IconButton>
  );
};

ChatPanelToggleButton.defaultProps = {
  children: <FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>,
};

export default ChatPanelToggleButton;
