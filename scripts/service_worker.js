self.importScripts("./vendor/gstatic.com_firebasejs_10.4.0_firebase-app-compat.js", "./vendor/gstatic.com_firebasejs_10.4.0_firebase-database-compat.js")

const config = {
  databaseURL: "radiorethinkprod-default-rtdb.firebaseio.com"
}

let playlistIsUpdated = false;

firebase.initializeApp(config);
const playlistRef = firebase.database().ref('playlistData/wfmu');

waitForPlaylistUpdate();

// Update the playlist data in local storage with updates from firebase
playlistRef.on("value", function(snapshot) {
  const changedPost = snapshot.val();
  const { artist, track, onNowJSON, artistBlurb, playlistID } = changedPost;
  chrome.storage.local.set({artist, track, onNowJSON, artistBlurb, playlistID});
})

// reset the audio state on startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.set({audioState: false});
})


/** 
 * @param {Object} request
 * @param {Object} sender
 * @param {Function} sendResponse
 * @return {boolean}
 * Respond to front-end request for latest playlist data
 * playlistIsUpdated tells the front-end whether the playlist data is fresh (after the background worker wakes up from inactivity)
 * Using .then() here and returning true to indicate that we will send a response
 * asynchronously.
 * see https://stackoverflow.com/questions/44056271/chrome-runtime-onmessage-response-with-async-await
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.hasOwnProperty("destination") && request.destination === "updatePlaylist") {
    getPlaylistData().then((playlistData) => {
      sendResponse({playlistIsUpdated, playlistData});
    });
    return true;
  }
});

/**
 * @return {Promise <Object>}
 * @description Get the latest playlist data from local storage
 */
async function getPlaylistData() {
  const { artist, track, playlistID, artistBlurb, onNowJSON } = await chrome.storage.local.get(["artist", "track", "playlistID", "artistBlurb", "onNowJSON"]);
  return {
    artist,
    track,
    playlistID,
    artistBlurb,
    onNowJSON
  }
}

/**
 * @return {void}
 * @description Waits for an update from firebase to tell the front end that playlist data is fresh
 */
function waitForPlaylistUpdate() {
  const p = new Promise((resolve, reject) => {
    playlistRef.once("value", function(snapshot) {
      const changedPost = snapshot.val();
      if (changedPost) {
        const { artist, track, onNowJSON, artistBlurb, playlistID } = changedPost;
        chrome.storage.local.set({artist, track, onNowJSON, artistBlurb, playlistID});
        resolve(true);
      }
      else {
        reject("No playlist data found");
      }
    });
  });

  p.then(() => {
    playlistIsUpdated = true;
  });
}
