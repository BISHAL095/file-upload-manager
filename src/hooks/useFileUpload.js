import { useReducer } from 'react';

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
  return { files: state.files, dispatch };
}