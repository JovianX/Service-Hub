import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

import ReleaseItem from './ReleaseItem';

const Releases = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      content={<ReleaseItem />}
      scroll={isMobile ? 'normal' : 'content'}
      className='px-24 pt-[34px]'
    />
  );
};

export default Releases;
