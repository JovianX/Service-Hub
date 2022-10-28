import MonacoEditor from '@uiw/react-monacoeditor';
import YAML from 'json-to-pretty-yaml';
import { useEffect, useState } from 'react';

const UserSuppliedValue = ({ userSupplied }) => {
  const [userSuppliedValue, setUserSuppliedValue] = useState('');

  useEffect(() => {
    setUserSuppliedValue(YAML.stringify(userSupplied));
  }, [userSupplied]);

  return (
    <MonacoEditor
      height='150px'
      value={userSuppliedValue}
      language='yaml'
      options={{ theme: 'vs-dark', readOnly: true, automaticLayout: true }}
    />
  );
};

export default UserSuppliedValue;
