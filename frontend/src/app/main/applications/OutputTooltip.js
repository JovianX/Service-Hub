import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 600,
    padding: 12,
  },
});

const OutputTooltip = memo(({ output }) => {
  return (
    <CustomWidthTooltip
      disableFocusListener
      disableTouchListener
      placement='bottom'
      title={<Typography fontSize={14}>{output}</Typography>}
    >
      <Button>
        <ExpandMoreIcon />
      </Button>
    </CustomWidthTooltip>
  );
});

export default OutputTooltip;
