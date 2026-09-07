import FileItem from './FileItem';

export default function FileList({ files, onStart, onCancel, onRetry }) {
  return (
    <div>
      {files.map(file => (
        <FileItem
          key={file.id}
          file={file}
          onStart={onStart}
          onCancel={onCancel}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}