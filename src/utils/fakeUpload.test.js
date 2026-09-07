import { describe, it, expect, vi } from 'vitest';
import { fakeUpload } from './fakeUpload';

describe('fakeUpload', () => {
  it('calls onProgress as time advances', () => {
    vi.useFakeTimers();
    const onProgress = vi.fn();
    fakeUpload({ onProgress, onComplete: vi.fn(), onError: vi.fn() });

    vi.advanceTimersByTime(500);
    expect(onProgress).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('eventually calls onComplete or onError, not both', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const onError = vi.fn();
    fakeUpload({ onProgress: vi.fn(), onComplete, onError });

    vi.advanceTimersByTime(15000); // worst case is 10000ms, add margin

    const calledComplete = onComplete.mock.calls.length > 0;
    const calledError = onError.mock.calls.length > 0;
    expect(calledComplete !== calledError).toBe(true);

    vi.useRealTimers();
    });

  it('cancel stops further progress calls', () => {
    vi.useFakeTimers();
    const onProgress = vi.fn();
    const controller = fakeUpload({ onProgress, onComplete: vi.fn(), onError: vi.fn() });

    vi.advanceTimersByTime(500);
    const callsBeforeCancel = onProgress.mock.calls.length;
    controller.cancel();
    vi.advanceTimersByTime(2000);

    expect(onProgress.mock.calls.length).toBe(callsBeforeCancel); // no more calls after cancel

    vi.useRealTimers();
  });
});