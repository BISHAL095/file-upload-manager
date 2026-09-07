import { useFileUpload } from './hooks/useFileUpload';
import FileList from './components/FileList';
import UploadZone from './components/UploadZone';

function App() {
  const { files, dispatch, startUpload, cancelUpload, retryUpload } = useFileUpload();

  const handleFilesAdded = (fileArray) => {
    dispatch({ type: 'ADD_FILES', payload: fileArray });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-brand"><span className="brand-mark" aria-hidden="true" /> File Upload Manager</div>
        <p>Upload and manage your files in one place.</p>
      </header>

      <UploadZone onFilesSelected={handleFilesAdded} />

      <div className="file-list">
        <FileList
          files={files}
          onStart={startUpload}
          onCancel={cancelUpload}
          onRetry={retryUpload}
        />
      </div>
    </div>
  );
}

export default App;