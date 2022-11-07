import MonacoEditor from '@uiw/react-monacoeditor';
import YAML from 'json-to-pretty-yaml';
import { useEffect, useState } from 'react';

const ManifestsValue = ({ manifests }) => {
  const [manifestsToString, setManifestsToString] = useState('');
  const manifestsWithDivider = [];

  useEffect(() => {
    if (manifests === undefined) {
      setManifestsToString('Loading data...');
    } else {
      const divider = '---\n';
      manifests.forEach((item, index) => {
        const itemInYaml = YAML.stringify(item) + (index !== manifests.length - 1 ? divider : '');
        manifestsWithDivider.push(itemInYaml);
      });
      setManifestsToString(manifestsWithDivider.join(''));
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
