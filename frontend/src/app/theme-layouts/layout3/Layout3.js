import FuseDialog from '@fuse/core/FuseDialog';
import { styled } from '@mui/material/styles';
import FuseMessage from '@fuse/core/FuseMessage';
import FuseSuspense from '@fuse/core/FuseSuspense';
import clsx from 'clsx';
import { memo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import AppContext from 'app/AppContext';
import { selectFuseCurrentLayoutConfig } from 'app/store/fuse/settingsSlice';
import FooterLayout3 from './components/FooterLayout3';
import LeftSideLayout3 from './components/LeftSideLayout3';
import NavbarWrapperLayout3 from './components/NavbarWrapperLayout3';
import RightSideLayout3 from './components/RightSideLayout3';
import ToolbarLayout3 from './components/ToolbarLayout3';
import SettingsPanel from '../shared-components/SettingsPanel';

const Root = styled('div')(({ theme, config }) => ({
  ...(config.mode === 'boxed' && {
    clipPath: 'inset(0)',
    maxWidth: `${config.containerWidth}px`,
    margin: '0 auto',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }),
  ...(config.mode === 'container' && {
    '& .container': {
      maxWidth: `${config.containerWidth}px`,
      width: '100%',
      margin: '0 auto',
    },
  }),
}));

function Layout3(props) {
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const appContext = useContext(AppContext);
  const { routes } = appContext;
  return (
    <Root id="fuse-layout" className="w-full flex" config={config}>
      {config.leftSidePanel.display && <LeftSideLayout3 />}

      <div className="flex flex-col flex-auto min-w-0">
        <main id="fuse-main" className="flex flex-col flex-auto min-h-full min-w-0 relative">
          {config.navbar.display && (
            <NavbarWrapperLayout3
              className={clsx(config.navbar.style === 'fixed' && 'sticky top-0 z-50')}
            />
          )}

          {config.toolbar.display && (
            <ToolbarLayout3
              className={clsx(
                config.toolbar.style === 'fixed' && 'sticky top-0',
                config.toolbar.position === 'above' && 'order-first z-40'
              )}
            />
          )}

          <div className="sticky top-0 z-99">
            <SettingsPanel />
          </div>

          <div className="flex flex-col flex-auto min-h-0 relative z-10">
            <FuseDialog />

            <FuseSuspense>{useRoutes(routes)}</FuseSuspense>

            {props.children}
          </div>

          {config.footer.display && (
            <FooterLayout3 className={config.footer.style === 'fixed' && 'sticky bottom-0'} />
          )}
        </main>
      </div>

      {config.rightSidePanel.display && <RightSideLayout3 />}
      <FuseMessage />
    </Root>
  );
}

export default memo(Layout3);
