import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import { memo } from 'react';
import _ from '@lodash';
import GlobalStyles from '@mui/material/GlobalStyles';
import FuseNavHorizontalLayout1 from './horizontal/FuseNavHorizontalLayout1';
import FuseNavVerticalLayout1 from './vertical/FuseNavVerticalLayout1';
import FuseNavVerticalLayout2 from './vertical/FuseNavVerticalLayout2';
import FuseNavHorizontalCollapse from './horizontal/types/FuseNavHorizontalCollapse';
import FuseNavHorizontalGroup from './horizontal/types/FuseNavHorizontalGroup';
import FuseNavHorizontalItem from './horizontal/types/FuseNavHorizontalItem';
import FuseNavHorizontalLink from './horizontal/types/FuseNavHorizontalLink';
import FuseNavVerticalCollapse from './vertical/types/FuseNavVerticalCollapse';
import FuseNavVerticalGroup from './vertical/types/FuseNavVerticalGroup';
import FuseNavVerticalItem from './vertical/types/FuseNavVerticalItem';
import FuseNavVerticalLink from './vertical/types/FuseNavVerticalLink';
import { registerComponent } from './FuseNavItem';

const inputGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      '.popper-navigation-list': {
        '& .fuse-list-item': {
          padding: '8px 12px 8px 12px',
          height: 40,
          minHeight: 40,
          '& .fuse-list-item-text': {
            padding: '0 0 0 8px',
          },
        },
        '&.dense': {
          '& .fuse-list-item': {
            minHeight: 32,
            height: 32,
            '& .fuse-list-item-text': {
              padding: '0 0 0 8px',
            },
          },
        },
      },
    })}
  />
);

/*
Register Fuse Navigation Components
 */
registerComponent('vertical-group', FuseNavVerticalGroup);
registerComponent('vertical-collapse', FuseNavVerticalCollapse);
registerComponent('vertical-item', FuseNavVerticalItem);
registerComponent('vertical-link', FuseNavVerticalLink);
registerComponent('horizontal-group', FuseNavHorizontalGroup);
registerComponent('horizontal-collapse', FuseNavHorizontalCollapse);
registerComponent('horizontal-item', FuseNavHorizontalItem);
registerComponent('horizontal-link', FuseNavHorizontalLink);
registerComponent('vertical-divider', () => <Divider className="my-16" />);
registerComponent('horizontal-divider', () => <Divider className="my-16" />);

function FuseNavigation(props) {
  const options = _.pick(props, [
    'navigation',
    'layout',
    'active',
    'dense',
    'className',
    'onItemClick',
    'firstLevel',
    'selectedId',
  ]);
  if (props.navigation.length > 0) {
    return (
      <>
        {inputGlobalStyles}
        {props.layout === 'horizontal' && <FuseNavHorizontalLayout1 {...options} />}
        {props.layout === 'vertical' && <FuseNavVerticalLayout1 {...options} />}
        {props.layout === 'vertical-2' && <FuseNavVerticalLayout2 {...options} />}
      </>
    );
  }
  return null;
}

FuseNavigation.propTypes = {
  navigation: PropTypes.array.isRequired,
};

FuseNavigation.defaultProps = {
  layout: 'vertical',
};

export default memo(FuseNavigation);
