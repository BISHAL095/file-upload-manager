import { useFileUpload } from './hooks/useFileUpload';
import FileList from './components/FileList';
import UploadZone from './components/UploadZone';

function App() {
  const { files, dispatch, startUpload, cancelUpload, retryUpload } = useFileUpload();

  const handleFilesAdded = (fileArray) => {
    dispatch({ type: 'ADD_FILES', payload: fileArray });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>File Upload Manager</h1>

      <UploadZone onFilesSelected={handleFilesAdded} />

      <FileList
        files={files}
        onStart={startUpload}
        onCancel={cancelUpload}
        onRetry={retryUpload}
      />
    </div>
  );
}

export default App;