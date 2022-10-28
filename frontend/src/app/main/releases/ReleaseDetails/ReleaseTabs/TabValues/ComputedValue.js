import MonacoEditor from '@uiw/react-monacoeditor';
import YAML from 'json-to-pretty-yaml';
import { useEffect, useState } from 'react';

const ComputedValue = ({ computedValues }) => {
  const [computedValuesValue, setComputedValuesValue] = useState('');

  useEffect(() => {
    setComputedValuesValue(YAML.stringify(computedValues));
  }, [computedValues]);

  return (
    <MonacoEditor
      height='350px'
      value={computedValuesValue || ''}
      language='yaml'
      options={{ theme: 'vs-dark', readOnly: true, automaticLayout: true }}
    />
  );
};

export default ComputedValue;
