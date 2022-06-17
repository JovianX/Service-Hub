import Button from '@mui/material/Button';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function PurchaseButton({ className }) {
  return (
    <Button
      component="a"
      href="https://1.envato.market/zDGL6"
      target="_blank"
      rel="noreferrer noopener"
      role="button"
      className={clsx('', className)}
      variant="contained"
      color="secondary"
      startIcon={<FuseSvgIcon size={16}>heroicons-outline:shopping-cart</FuseSvgIcon>}
    >
      Purchase FUSE React
    </Button>
  );
}

export default PurchaseButton;
