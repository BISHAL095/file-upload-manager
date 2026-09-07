import { describe, it, expect } from 'vitest';
import { fileReducer } from './useFileUpload';

describe('fileReducer', () => {
  const baseFile = {
    id: '1',
    name: 'test.png',
    size: 1000,
    status: 'Pending',
    progress: 0,
    error: null
  };

  it('ADD_FILES adds new items with correct initial shape', () => {
    const fakeFile = new File(['x'], 'test.png');
    const result = fileReducer({ files: [] }, { type: 'ADD_FILES', payload: [fakeFile] });

    expect(result.files).toHaveLength(1);
    expect(result.files[0].status).toBe('Pending');
    expect(result.files[0].progress).toBe(0);
    expect(result.files[0].error).toBeNull();
  });

  it('UPDATE_FILE_STATUS updates only progress, leaves status/error untouched', () => {
    const state = { files: [{ ...baseFile, status: 'Uploading', error: null }] };
    const result = fileReducer(state, {
      type: 'UPDATE_FILE_STATUS',
      payload: { id: '1', progress: 42 }
    });

    expect(result.files[0].progress).toBe(42);
    expect(result.files[0].status).toBe('Uploading'); // unchanged
  });

  it('UPDATE_FILE_STATUS does not affect other files in the list', () => {
    const state = {
      files: [
        { ...baseFile, id: '1' },
        { ...baseFile, id: '2', progress: 50 }
      ]
    };
    const result = fileReducer(state, {
      type: 'UPDATE_FILE_STATUS',
      payload: { id: '1', progress: 99 }
    });

    expect(result.files.find(f => f.id === '1').progress).toBe(99);
    expect(result.files.find(f => f.id === '2').progress).toBe(50); // untouched
  });

  it('UPDATE_FILE_STATUS clears error explicitly when passed null', () => {
    const state = { files: [{ ...baseFile, status: 'Failed', error: 'network error' }] };
    const result = fileReducer(state, {
      type: 'UPDATE_FILE_STATUS',
      payload: { id: '1', status: 'Completed', progress: 100, error: null }
    });

    expect(result.files[0].error).toBeNull();
  });

  it('REMOVE_FILE removes the correct file only', () => {
    const state = { files: [{ ...baseFile, id: '1' }, { ...baseFile, id: '2' }] };
    const result = fileReducer(state, { type: 'REMOVE_FILE', payload: { id: '1' } });

    expect(result.files).toHaveLength(1);
    expect(result.files[0].id).toBe('2');
  });
});