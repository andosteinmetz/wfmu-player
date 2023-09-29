const button = document.querySelector('.play');

let creating; // A global promise to avoid concurrency issues
let audioState = false;

async function updateAudioState() {
  state = await chrome.storage.local.get(['audioState']);
  audioState = state.audioState;
}

function updateUI(audioState) {
  button.innerHTML = audioState ? "Pause WFMU" : "Play WFMU";
  chrome.action.setBadgeText({
    text: audioState ? "ON" : ""
  });
  if (audioState) {
    button.classList.remove('paused')
  }
  else {
    button.classList.add('paused');
  }
}

async function init() {
  await updateAudioState();
  updateUI(audioState);
}

init();

async function setupOffscreenDocument(path) {
  // Check all windows controlled by the service worker to see if one 
  // of them is the offscreen document with the given path
  const offscreenUrl = chrome.runtime.getURL(path);
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl]
  });

  if (existingContexts.length > 0) {
    return;
  }

  // create offscreen document
  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Playing WFMU',
    });
    await creating;
    creating = null;
  }
}

async function toggleAudio() {
  audioState = !audioState;
  chrome.storage.local.set({audioState: audioState});
  const response = await chrome.runtime.sendMessage({
    audioState: audioState
  });
  if (response.success) {
    updateUI(audioState);
  }
}

button.addEventListener("click", async () => {
  console.log('clicked');
  await setupOffscreenDocument('background.html');
  await toggleAudio();  
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.audioState) {
    chrome.action.setBadgeText({
      text: request.audioState
    });
  }
});

