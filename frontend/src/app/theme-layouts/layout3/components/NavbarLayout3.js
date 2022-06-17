import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import Navigation from '../../shared-components/Navigation';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

function NavbarLayout3(props) {
  return (
    <Root className={clsx('w-full h-64 min-h-64 max-h-64 shadow-md', props.className)}>
      <div className="flex flex-auto items-center w-full h-full container px-16 lg:px-24">
        <FuseScrollbars className="flex h-full items-center">
          <Navigation className="w-full" layout="horizontal" dense />
        </FuseScrollbars>
      </div>
    </Root>
  );
}

export default memo(NavbarLayout3);
