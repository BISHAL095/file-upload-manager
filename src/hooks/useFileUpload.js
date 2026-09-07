import { useReducer, useRef } from 'react';
import { fakeUpload } from '../utils/fakeUpload';

const initialState = {
  files: [] 
};

function fileReducer(state, action) {
  switch (action.type) {
    case 'ADD_FILES': {
      const newItems = action.payload.map(file => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        status: 'Pending',
        progress: 0,
        error: null
      }));
      return { files: [...state.files, ...newItems] };
    }
    case 'UPDATE_FILE_STATUS': {
      const { id, status, progress, error } = action.payload;
      return {
        files: state.files.map(file =>
          file.id === id
              ? {
                ...file,
                status: status ?? file.status,
                progress: progress ?? file.progress,
                error: error
            }
            : file
          )
      };
    }
    case 'REMOVE_FILE': {
      const { id } = action.payload;
      return {
        files: state.files.filter(file => file.id !== id)
      };
    }   
    default:
      return state;
  }
}

export { fileReducer };

export function useFileUpload() {
  const [state, dispatch] = useReducer(fileReducer, initialState);
  const controllersRef = useRef({});
  const MAX_CONCURRENT = 3;
  const activeUploads = useRef(new Set());
  const queue = useRef([]);

  function startUpload(fileId) {
    const fileItem = state.files.find(file => file.id === fileId);

    if (!fileItem) return;

    if (activeUploads.current.size >= MAX_CONCURRENT) {
        queue.current.push(() => startUpload(fileId));
        return;
    }
    activeUploads.current.add(fileId);

    const controller = fakeUpload({
      onProgress: (progress) => {
        dispatch({
          type: 'UPDATE_FILE_STATUS',
          payload: { id: fileId,status: 'Uploading', progress, error: null }
        });
      },
      onComplete: () => {
        dispatch({
          type: 'UPDATE_FILE_STATUS',
          payload: { id: fileId, status: 'Completed', progress: 100, error: null }
        });
        delete controllersRef.current[fileId];
        activeUploads.current.delete(fileId);
        processQueue();
      },
      onError: (error) => {
        dispatch({
          type: 'UPDATE_FILE_STATUS',
          payload: { id: fileId, status: 'Failed', error }
        });
        delete controllersRef.current[fileId];
        activeUploads.current.delete(fileId);
        processQueue();
      }
    });

    controllersRef.current[fileId] = controller;
  } 
  function cancelUpload(fileId) {
    const controller = controllersRef.current[fileId];
    if (controller) {
      controller.cancel();
      dispatch({ type: 'REMOVE_FILE', payload: { id: fileId } });
      delete controllersRef.current[fileId];
    }
    activeUploads.current.delete(fileId);
    processQueue();
  }
  function retryUpload(fileId){
    const fileItem = state.files.find(file => file.id === fileId);
    if (fileItem) {
      dispatch({
        type: 'UPDATE_FILE_STATUS',
        payload: { id: fileId, status: 'Pending', progress: 0, error: null }
      });
      startUpload(fileId);
    }   
  }
  function processQueue() {
    while (activeUploads.current.size < MAX_CONCURRENT && queue.current.length > 0) {
      const next = queue.current.shift();
      next();
    }
}

  return { files: state.files, dispatch, startUpload, cancelUpload, retryUpload };
}


