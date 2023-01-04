import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

import ApplicationItem from './ApplicationItem';

const Application = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      content={<ApplicationItem />}
      scroll={isMobile ? 'normal' : 'content'}
      className='px-24 pt-[34px]'
    />
  );
};

export default Application;
