import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileUpload } from './useFileUpload';

function makeFakeFiles(count) {
  return Array.from({ length: count }, (_, i) => new File(['x'], `file${i}.png`));
}

describe('useFileUpload concurrency', () => {
  it('only allows 3 uploads to be Uploading at once', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useFileUpload());

    act(() => {
      result.current.dispatch({ type: 'ADD_FILES', payload: makeFakeFiles(5) });
    });

    const ids = result.current.files.map(f => f.id);

    act(() => {
      ids.forEach(id => result.current.startUpload(id));
    });

    act(() => {
      vi.advanceTimersByTime(500); 
    });

    const uploadingCount = result.current.files.filter(f => f.status === 'Uploading').length;
    expect(uploadingCount).toBeLessThanOrEqual(3);

    vi.useRealTimers();
  });

  it('starts a queued upload once an active one finishes', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useFileUpload());

    act(() => {
      result.current.dispatch({ type: 'ADD_FILES', payload: makeFakeFiles(4) });
    });

    const ids = result.current.files.map(f => f.id);

    act(() => {
      ids.forEach(id => result.current.startUpload(id));
    });

    // 4th file should not be Uploading yet — only 3 slots available
    let fourth = result.current.files.find(f => f.id === ids[3]);
    expect(fourth.status).toBe('Pending');

    // advance enough time for the first 3 to definitely finish (worst case ~10s each)
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    fourth = result.current.files.find(f => f.id === ids[3]);
    expect(fourth.status).not.toBe('Pending');

    vi.useRealTimers();
  });
});