import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TableHeader from 'app/shared-components/TableHeader';

import AccessTokensPage from './AccessTokensPage';

const AccessTokens = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<TableHeader title='Access tokens' />}
      content={<AccessTokensPage />}
      scroll={isMobile ? 'normal' : 'content'}
      className='px-24'
    />
  );
};

export default AccessTokens;
