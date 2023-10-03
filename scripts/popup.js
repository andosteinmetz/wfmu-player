const button = document.querySelector('.play');
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.hasOwnProperty("audioState") && request.audioState) {
    chrome.action.setBadgeText({
      text: request.audioState
    });
  }
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
  updateNowPlaying();
  setInterval(updateNowPlaying, 5000);
}

function fixLinks(){
  const links = document.querySelectorAll("a");

  links.forEach(link => {
    const location = link.getAttribute('href');
    link.addEventListener('click', () => chrome.tabs.create({active: true, url: location}));
  });
}

async function updateAudioState() {
  const state = await chrome.storage.local.get(['audioState']);
  audioState = state.audioState;
}

function updateUI(audioState) {
  // button.innerHTML = audioState ? "Pause WFMU" : "Play WFMU";
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

function onNowPropertyFactory(property){
  return (onNowJSON) => {
    const data = JSON.parse(onNowJSON);
    return data.DATA[0][data.COLUMNS.indexOf(property)]
  };
}

async function updateNowPlaying() {
  const response = await chrome.runtime.sendMessage({ destination: "updatePlaylist" });
  if (!response.hasOwnProperty("playlistData")) { 
    return
  }
  
  // avoid unnecessary DOM updates
  if (["artist", "track", "onNowJSON"].every(key => response.playlistData[key] === cachedPlaylistData[key])) {
    return;
  }
  const { artist, track, playlistID, artistBlurb, onNowJSON } = response.playlistData;
  artistContainer.innerHTML = artist;
  trackContainer.innerHTML = `\"${track}\" ${artist && "by "}`;
  artistContainer.title = artistBlurb || "";
  [showName, showHost, showURL] = ["showName", "showHost", "showURL"]
    .map(onNowPropertyFactory)
    .map(fn => fn(onNowJSON));

  showContainer.innerHTML = buildShowMarkup(showName, showHost, showURL, playlistID);
  }

function buildShowMarkup(showName, showHost, showURL, playlistID){
  return `on <a href="https://www.wfmu.org/playlists/shows/${playlistID}" target="_blank">${showName}</a> ${showHost && "with"} <a href="${showURL}" target="_blank">${showHost}</a>`;
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
