
export function fakeUpload({ onProgress, onComplete, onError }) {
  let progress = 0;
  let intervalId = setInterval(() => {

    // Simulate progress increment
    const increment = Math.floor(Math.random() * 11) + 5;

    progress = Math.min(progress + increment, 100);
    onProgress(progress);

    if (progress >= 100) {
      clearInterval(intervalId);

      const isSuccess = Math.random() > 0.2; // 80% chance of success

      if (isSuccess) {
        onComplete();
      } else {
        onError('Upload failed due to network error.');
      }
    }
  }, 500); // Update every 500ms
  
  return {
    cancel: () => {
      clearInterval(intervalId);
    }
  };
}