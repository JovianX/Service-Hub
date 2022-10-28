import MonacoEditor from '@uiw/react-monacoeditor';
import YAML from 'json-to-pretty-yaml';
import { useEffect, useState } from 'react';

const HelmHooksValue = ({ helmHooks }) => {
  const [helmHooksValue, setHelmHooksValue] = useState('');

  useEffect(() => {
    if (helmHooks === undefined) {
      setHelmHooksValue('Loading data...');
    } else {
      setHelmHooksValue(YAML.stringify(helmHooks));
    }
  }, [helmHooks]);

  return (
    <MonacoEditor
      height='400px'
      value={helmHooksValue || ''}
      language='yaml'
      options={{ theme: 'vs-dark', readOnly: true, automaticLayout: true }}
    />
  );
};

export default HelmHooksValue;
