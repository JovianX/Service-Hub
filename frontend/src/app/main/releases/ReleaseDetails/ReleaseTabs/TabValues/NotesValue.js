import MonacoEditor from '@uiw/react-monacoeditor';

const NotesValue = ({ notes }) => {
  return (
    <MonacoEditor
      height='355px'
      value={notes}
      language='yaml'
      options={{ theme: 'vs-dark', readOnly: true, automaticLayout: true }}
    />
  );
};

export default NotesValue;
