import MonacoEditor from '@uiw/react-monacoeditor';
import YAML from 'json-to-pretty-yaml';
import { useEffect, useState } from 'react';

const ManifestsValue = ({ manifests }) => {
  const [manifestsToString, setManifestsToString] = useState('');

  useEffect(() => {
    setManifestsToString(YAML.stringify(manifests));
  }, [manifests]);

  return (
    <MonacoEditor
      height='92%'
      value={manifestsToString ?? ''}
      language='yaml'
      options={{ theme: 'vs-dark', readOnly: true, automaticLayout: true }}
    />
  );
};

export default ManifestsValue;
