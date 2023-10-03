self.importScripts("./vendor/firebase-compat.js")

const config = {
  databaseURL: "radiorethinkprod-default-rtdb.firebaseio.com"
}
firebase.initializeApp(config);


const playlistRef = firebase.database().ref('playlistData/wfmu');

playlistRef.on("value", async function(snapshot){
  const changedPost = snapshot.val();
  // console.log(changedPost);
  const {artist, track, onNowJSON, artistBlurb, playlistID} = changedPost;
  chrome.storage.local.set({artist, track, onNowJSON, artistBlurb, playlistID});
})

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.set({audioState: false});
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.hasOwnProperty("destination") && request.destination === "updatePlaylist") {
    getPlaylistData().then((playlistData) => {
      sendResponse({playlistData});
    });
    return true;
  }
});

async function getPlaylistData() {
  const { artist, track, playlistID, artistBlurb, onNowJSON } = await chrome.storage.local.get(["artist", "track", "playlistID", "artistBlurb", "onNowJSON"]);
  // console.log(JSON.parse(onNowJSON))
  return {
    artist,
    track,
    playlistID,
    artistBlurb,
    onNowJSON
  }
}
