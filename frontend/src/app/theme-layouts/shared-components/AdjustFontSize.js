import { useState } from 'react';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const marks = [
  { value: 0.7, label: '70%' },
  { value: 0.8, label: '80%' },
  { value: 0.9, label: '90%' },
  { value: 1, label: '100%' },
  { value: 1.1, label: '110%' },
  { value: 1.2, label: '120%' },
  { value: 1.3, label: '130%' },
];

function AdjustFontSize(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [fontSize, setFontSize] = useState(1);

  function changeHtmlFontSize() {
    const html = document.getElementsByTagName('html')[0];
    html.style.fontSize = `${fontSize * 62.5}%`;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        className={clsx('w-40 h-40', props.className)}
        aria-controls="font-size-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="large"
      >
        <FuseSvgIcon>material-outline:format_size</FuseSvgIcon>
      </IconButton>
      <Menu
        classes={{ paper: 'w-320' }}
        id="font-size-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className="py-12 px-24">
          <Typography className="flex items-center justify-center text-16 font-semibold mb-8">
            <FuseSvgIcon color="action" className="mr-4">
              material-outline:format_size
            </FuseSvgIcon>
            Font Size
          </Typography>
          <Slider
            classes={{ markLabel: 'text-12 font-semibold' }}
            value={fontSize}
            track={false}
            aria-labelledby="discrete-slider-small-steps"
            step={0.1}
            marks={marks}
            min={0.7}
            max={1.3}
            valueLabelDisplay="off"
            onChange={(ev, value) => setFontSize(value)}
            onChangeCommitted={changeHtmlFontSize}
          />
        </div>
      </Menu>
    </div>
  );
}

export default AdjustFontSize;
