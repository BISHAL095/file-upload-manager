import formatBytes from '../utils/formatBytes';

export default function FileItem({ file, onStart, onCancel, onRetry }) {
  return (
    <div>
      <strong>{file.name}</strong> — {file.status} — {file.progress}% - {formatBytes(file.size)}
      {file.error && <span style={{ color: 'red' }}> ({file.error})</span>}

     {file.status !== 'Completed' && file.progress > 0 && (
        <div style={{ background: '#eee', height: 8, width: '100%' }}>
          <div style={{ background: '#4caf50', height: '100%', width: `${file.progress}%` }} />
        </div>
      )}

      <div>
        {file.status === 'Pending' && (
          <button onClick={() => onStart(file.id)}>Start</button>
        )}
        {file.status === 'Uploading' && (
          <button onClick={() => onCancel(file.id)}>Cancel</button>
        )}
        {file.status === 'Failed' && (
          <button onClick={() => onRetry(file.id)}>Retry</button>
        )}
      </div>
    </div>
  );
}