import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TableHeader from 'app/shared-components/TableHeader';

import GeneralSettingsList from './GeneralSettingsList';

const GeneralSettings = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<TableHeader title='General Settings' />}
      content={<GeneralSettingsList />}
      scroll={isMobile ? 'normal' : 'content'}
      className='px-24'
    />
  );
};

export default GeneralSettings;
