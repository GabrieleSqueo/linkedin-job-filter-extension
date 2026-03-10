// Background service worker for storing job list
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'jobs') {
    // save the job array to storage
    chrome.storage.local.set({ jobs: message.jobs }, () => {
      console.log('Job list saved', message.jobs);
    });
  }
});
