import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import format from 'date-fns/format';
import { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectQuickPanelData } from './store/dataSlice';
import reducer from './store';
import { selectQuickPanelState, toggleQuickPanel } from './store/stateSlice';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
  },
}));

function QuickPanel(props) {
  const dispatch = useDispatch();

  const data = useSelector(selectQuickPanelData);
  const state = useSelector(selectQuickPanelState);

  const [checked, setChecked] = useState('notifications');

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <StyledSwipeableDrawer
      open={state}
      anchor="right"
      onOpen={(ev) => {}}
      onClose={(ev) => dispatch(toggleQuickPanel())}
      disableSwipeToOpen
    >
      <FuseScrollbars>
        <ListSubheader component="div">Today</ListSubheader>

        <div className="mb-0 py-16 px-24">
          <Typography className="mb-12 text-32" color="text.secondary">
            {format(new Date(), 'eeee')}
          </Typography>
          <div className="flex">
            <Typography className="leading-none text-32" color="text.secondary">
              {format(new Date(), 'dd')}
            </Typography>
            <Typography className="leading-none text-16" color="text.secondary">
              th
            </Typography>
            <Typography className="leading-none text-32" color="text.secondary">
              {format(new Date(), 'MMMM')}
            </Typography>
          </div>
        </div>
        <Divider />
        <List>
          <ListSubheader component="div">Events</ListSubheader>
          {data &&
            data.events.map((event) => (
              <ListItem key={event.id}>
                <ListItemText primary={event.title} secondary={event.detail} />
              </ListItem>
            ))}
        </List>
        <Divider />
        <List>
          <ListSubheader component="div">Notes</ListSubheader>
          {data &&
            data.notes.map((note) => (
              <ListItem key={note.id}>
                <ListItemText primary={note.title} secondary={note.detail} />
              </ListItem>
            ))}
        </List>
        <Divider />
        <List>
          <ListSubheader component="div">Quick Settings</ListSubheader>
          <ListItem>
            <ListItemIcon className="min-w-40">
              <FuseSvgIcon>material-outline:notifications</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
            <ListItemSecondaryAction>
              <Switch
                color="primary"
                onChange={handleToggle('notifications')}
                checked={checked.indexOf('notifications') !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon className="min-w-40">
              <FuseSvgIcon>material-outline:cloud</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="Cloud Sync" />
            <ListItemSecondaryAction>
              <Switch
                color="secondary"
                onChange={handleToggle('cloudSync')}
                checked={checked.indexOf('cloudSync') !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon className="min-w-40">
              <FuseSvgIcon>material-outline:brightness_high</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="Retro Thrusters" />
            <ListItemSecondaryAction>
              <Switch
                color="primary"
                onChange={handleToggle('retroThrusters')}
                checked={checked.indexOf('retroThrusters') !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </FuseScrollbars>
    </StyledSwipeableDrawer>
  );
}

export default withReducer('quickPanel', reducer)(memo(QuickPanel));
