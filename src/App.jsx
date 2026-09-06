import { useFileUpload } from './hooks/useFileUpload';

function App() {
  const { files, dispatch } = useFileUpload();

  const handleFileSelect = (e) => {
    dispatch({ type: 'ADD_FILES', payload: Array.from(e.target.files) });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>File Upload Manager</h1>
      <input type="file" multiple onChange={handleFileSelect} />
      <pre>{JSON.stringify(files, null, 2)}</pre>
    </div>
  );
}

export default App;