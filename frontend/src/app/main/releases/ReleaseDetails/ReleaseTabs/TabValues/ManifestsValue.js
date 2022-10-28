import MonacoEditor from '@uiw/react-monacoeditor';
import YAML from 'json-to-pretty-yaml';
import { useEffect, useState } from 'react';

const ManifestsValue = ({ manifests }) => {
  const [manifestsToString, setManifestsToString] = useState('');

  useEffect(() => {
    if (manifests === undefined) {
      setManifestsToString('Loading data...');
    } else {
      setManifestsToString(YAML.stringify(manifests));
    }
  }, [manifests]);

  return (
    <MonacoEditor
      height='627px'
      value={manifestsToString}
      language='yaml'
      options={{ theme: 'vs-dark', readOnly: true, automaticLayout: true }}
    />
  );
};

export default ManifestsValue;
