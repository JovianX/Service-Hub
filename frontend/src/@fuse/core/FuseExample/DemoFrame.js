import * as React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { StyleSheetManager } from 'styled-components';
import { styled, useTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

function FramedDemo(props) {
  const { children, document } = props;

  const theme = useTheme();
  React.useEffect(() => {
    document.body.dir = theme.direction;
  }, [document, theme.direction]);

  const cache = React.useMemo(
    () =>
      createCache({
        key: `iframe-demo-${theme.direction}`,
        prepend: true,
        container: document.head,
        stylisPlugins: theme.direction === 'rtl' ? [rtlPlugin] : [],
      }),
    [document, theme.direction]
  );

  const getWindow = React.useCallback(() => document.defaultView, [document]);

  return (
    <StyleSheetManager
      target={document.head}
      stylisPlugins={theme.direction === 'rtl' ? [rtlPlugin] : []}
    >
      <CacheProvider value={cache}>
        <GlobalStyles
          styles={() => ({
            html: {
              fontSize: '62.5%',
            },
          })}
        />
        {React.cloneElement(children, {
          window: getWindow,
        })}
      </CacheProvider>
    </StyleSheetManager>
  );
}

FramedDemo.propTypes = {
  children: PropTypes.node,
  document: PropTypes.object.isRequired,
};

const Frame = styled('iframe')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  flexGrow: 1,
  height: 400,
  border: 0,
  boxShadow: theme.shadows[1],
}));

function DemoFrame(props) {
  const { children, name, ...other } = props;
  const title = `${name} demo`;
  /**
   * @type {import('react').Ref<HTMLIFrameElement>}
   */
  const frameRef = React.useRef(null);

  // If we portal content into the iframe before the load event then that content
  // is dropped in firefox.
  const [iframeLoaded, onLoad] = React.useReducer(() => true, false);

  React.useEffect(() => {
    const document = frameRef.current.contentDocument;
    // When we hydrate the iframe then the load event is already dispatched
    // once the iframe markup is parsed (maybe later but the important part is
    // that it happens before React can attach event listeners).
    // We need to check the readyState of the document once the iframe is mounted
    // and "replay" the missed load event.
    // See https://github.com/facebook/react/pull/13862 for ongoing effort in React
    // (though not with iframes in mind).
    if (document != null && document.readyState === 'complete' && !iframeLoaded) {
      onLoad();
    }
  }, [iframeLoaded]);
  const document = frameRef.current?.contentDocument;
  return (
    <>
      <Frame onLoad={onLoad} ref={frameRef} title={title} {...other} />
      {iframeLoaded !== false
        ? ReactDOM.createPortal(
            <FramedDemo document={document}>{children}</FramedDemo>,
            document.body
          )
        : null}
    </>
  );
}

DemoFrame.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
};

export default React.memo(DemoFrame);
