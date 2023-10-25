const button = document.querySelector('.play');
const buttonText = button.querySelector('.button__accessibility-text');
const loadingAnimation = document.querySelector('.loading-animation');
const nowPlaying = document.querySelector('.now-playing');
const artistContainer = nowPlaying.querySelector('.artist');
const trackContainer = nowPlaying.querySelector('.track');
const showContainer = nowPlaying.querySelector('.show');

let creating; // A global promise to avoid concurrency issues
let audioState = false;

let cachedPlaylistData = {};

init();

button.addEventListener("click", async () => {
  disableButton();
  await setupOffscreenDocument('background.html');
  await toggleAudio();  
  enableButton();
  return true;
});

function disableButton() {
  button.ariaDisabled = true;
  button.setAttribute("disabled", "disabled");
  loadingAnimation.classList.remove("hidden");
}

function enableButton() {
  loadingAnimation.classList.add("hidden");
  button.ariaDisabled = false;
  button.removeAttribute("disabled");
}

async function init() {
  setupOffscreenDocument('background.html');
  await updateAudioState();
  updateUI(audioState);
  updatePlaylist();
  setInterval(updatePlaylist, 1000);
}

async function updateAudioState() {
  const state = await chrome.storage.local.get(['audioState']);
  audioState = state.audioState;
}

function updateUI(audioState) {
  buttonText.innerHTML = audioState ? "Pause WFMU" : "Play WFMU";
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

/**
 * @param {string} property 
 * @returns {Function}
 * @description Factory function to return a function that will return the value of a property from the onNowJSON
 * which is scructured as two arrays, one of column names and one of data.
 */
function onNowPropertyFactory(property) {
  return (onNowJSON) => {
    const data = JSON.parse(onNowJSON);
    return data.DATA[0][data.COLUMNS.indexOf(property)]
  };
}

async function updatePlaylist() {
  const response = await chrome.runtime.sendMessage({ destination: "updatePlaylist" });
  if (!response.hasOwnProperty("playlistData")) { 
    return
  }
  // check that data is in service worker is fresh and update UI accordingly
  if(response.playlistIsUpdated && nowPlaying.classList.contains("loading")){
    removePlaylistLoadingState();
  }
  // avoid unnecessary DOM updates
  if (["artist", "track", "onNowJSON"].every(key => response.playlistData[key] === cachedPlaylistData[key])) {
    return;
  }
  cachedPlaylistData = response.playlistData;
  updateNowPlayingMarkup(response.playlistData);
}

function removePlaylistLoadingState() {
  nowPlaying.classList.remove("loading");
}

function updateNowPlayingMarkup(playlistData) {
  const { artist, track, playlistID, artistBlurb, onNowJSON } = playlistData;
  artistContainer.innerHTML = `by <strong>${artist}</strong>`;
  trackContainer.innerHTML = `\"${track}\"`;
  artistContainer.title = artistBlurb || "";
  updateShowInfo(onNowJSON, playlistID);
}

/**
 * @description Updates the show name and host in the UI.
 * Accounts for the data structure of onNowJSON 
 * @param {string} onNowJSON
 * @param {string} playlistID 
 */
function updateShowInfo(onNowJSON, playlistID) {
  [showName, showHost] = ["showName", "showHost"]
    .map(onNowPropertyFactory)
    .map(fn => fn(onNowJSON));
  showContainer.innerHTML = buildShowMarkup(showName, showHost, playlistID);
}

function buildShowMarkup(showName, showHost, playlistID) {
  return `on <a href="https://www.wfmu.org/playlists/shows/${playlistID}" target="_blank">${showName}</a> ${showHost && "with"}<br>${showHost}`;
}

async function toggleAudio() {
  audioState = !audioState;
  const response = await chrome.runtime.sendMessage({
    audioState: audioState
  });
  if (response.success) {
    updateUI(audioState);
    chrome.storage.local.set({audioState: audioState});
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
