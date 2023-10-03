const button = document.querySelector('.play');
const nowPlaying = document.querySelector('.now-playing');
const artistContainer = nowPlaying.querySelector('.artist');
const trackContainer = nowPlaying.querySelector('.track');
const showContainer = nowPlaying.querySelector('.show');

let creating; // A global promise to avoid concurrency issues
let audioState = false;

init();

button.addEventListener("click", async () => {
  button.ariaDisabled = true;
  button.disabled = true;
  await setupOffscreenDocument('background.html');
  await toggleAudio();  
  button.ariaDisabled = false;
  button.disabled = false;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.hasOwnProperty("audioState") && request.audioState) {
    chrome.action.setBadgeText({
      text: request.audioState
    });
  }
});

async function init() {
  await updateAudioState();
  updateUI(audioState);
  updateNowPlaying();
  setInterval(updateNowPlaying, 5000);
}

async function updateAudioState() {
  const state = await chrome.storage.local.get(['audioState']);
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

function getShowName(onNowJSON){
  const data = JSON.parse(onNowJSON);
  console.log(data);
  const showNameIndex = data.COLUMNS.indexOf("showName");
  return data.DATA[0][showNameIndex];
}

async function updateNowPlaying() {
  const response = await chrome.runtime.sendMessage({ destination: "updatePlaylist" });
  if(response.hasOwnProperty("playlistData")){
    artistContainer.innerHTML = `${response.playlistData.artist} ${response.playlistData.track && " - "}`;
    trackContainer.innerHTML = response.playlistData.track;
    showContainer.innerHTML = `on ${getShowName(response.playlistData.onNowJSON)}`;
  }
}

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
