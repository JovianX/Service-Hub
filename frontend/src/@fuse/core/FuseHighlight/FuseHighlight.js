import * as Prism from 'prismjs';
import PropTypes from 'prop-types';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import './prism-languages';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

function FuseHighlight(props) {
  const highlight = useCallback(() => {
    Prism.highlightElement(domNode.current, props.async);
  }, [props.async]);

  const trimCode = useCallback(() => {
    let sourceString = props.children;

    if (typeof sourceString === 'object' && sourceString.default) {
      sourceString = sourceString.default;
    }

    // Split the source into lines
    const sourceLines = sourceString.split('\n');

    // Remove the first and the last line of the source
    // code if they are blank lines. This way, the html
    // can be formatted properly while using fuse-highlight
    // component
    if (!sourceLines[0].trim()) {
      sourceLines.shift();
    }

    if (!sourceLines[sourceLines.length - 1].trim()) {
      sourceLines.pop();
    }

    // Find the first non-whitespace char index in
    // the first line of the source code
    const indexOfFirstChar = sourceLines[0].search(/\S|$/);

    // Generate the trimmed source
    let sourceRaw = '';

    // Iterate through all the lines
    sourceLines.forEach((line, index) => {
      // Trim the beginning white space depending on the index
      // and concat the source code
      sourceRaw += line.substr(indexOfFirstChar, line.length);

      // If it's not the last line...
      if (index !== sourceLines.length - 1) {
        // Add a line break at the end
        sourceRaw = `${sourceRaw}\n`;
      }
    });
    return sourceRaw;
  }, [props.children]);

  const domNode = useRef(null);

  const [source, setSource] = useState(trimCode());

  useEffect(() => {
    setSource(trimCode());
  }, [trimCode]);

  useEffect(() => {
    highlight();
  }, [highlight, source]);

  const { className, component: Wrapper } = props;

  return (
    <Wrapper ref={domNode} className={clsx('border', className)}>
      {source}
    </Wrapper>
  );
}

FuseHighlight.propTypes = {
  component: PropTypes.node,
};
FuseHighlight.defaultProps = {
  component: 'code',
};

export default memo(styled(FuseHighlight)``);
