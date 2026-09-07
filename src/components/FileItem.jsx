import formatBytes from '../utils/formatBytes';

export default function FileItem({ file, onStart, onCancel, onRetry }) {
  return (
    <div className={`file-item status-${file.status.toLowerCase()}`}>
      <div className="file-item-name">
        <span className="file-type-icon">{file.name.includes('.') ? '▤' : '□'}</span>
        <strong title={file.name}>{file.name}</strong>
      </div>
      <div className="file-item-status">
        <span className="status-dot" />
        <span>{file.status}</span>
        <span className="progress-label">{file.progress}% · {formatBytes(file.size)}</span>
      </div>
      <div className="file-item-action">
        {file.status === 'Pending' && (
          <button className="file-action" onClick={() => onStart(file.id)}>Start</button>
        )}
        {file.status === 'Uploading' && (
          <button className="file-action danger" onClick={() => onCancel(file.id)}>Cancel</button>
        )}
        {file.status === 'Failed' && (
          <button className="file-action" onClick={() => onRetry(file.id)}>Retry</button>
        )}
      </div>
      {file.error && <span className="file-error">({file.error})</span>}
      {file.status !== 'Completed' && file.progress > 0 && (
        <div className="file-progress-track"><div className="file-progress-fill" style={{ width: `${file.progress}%` }} /></div>
      )}
    </div>
  );
}