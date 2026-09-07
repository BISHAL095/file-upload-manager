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
                error: error ?? file.error
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

export function useFileUpload() {
  const [state, dispatch] = useReducer(fileReducer, initialState);
  const controllersRef = useRef({});

  function startUpload(fileId) {
    const fileItem = state.files.find(file => file.id === fileId);
    if (!fileItem) return;

    const controller = fakeUpload({
      onProgress: (progress) => {
        dispatch({
          type: 'UPDATE_FILE_STATUS',
          payload: { id: fileId,status: 'Uploading', progress }
        });
      },
      onComplete: () => {
        dispatch({
          type: 'UPDATE_FILE_STATUS',
          payload: { id: fileId, status: 'Completed', progress: 100, error: null }
        });
      },
      onError: (error) => {
        dispatch({
          type: 'UPDATE_FILE_STATUS',
          payload: { id: fileId, status: 'Failed', error }
        });
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

  return { files: state.files, dispatch, startUpload, cancelUpload, retryUpload };
}