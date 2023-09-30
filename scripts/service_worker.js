self.importScripts("./vendor/firebase-compat.js")

const config = {
  databaseURL: "radiorethinkprod-default-rtdb.firebaseio.com"
}
firebase.initializeApp(config);


const playlistRef = firebase.database().ref('playlistData/wfmu');

playlistRef.on("value", async function(snapshot){
  const changedPost = snapshot.val();
  chrome.storage.local.set({
    artist: changedPost.artist, 
    track: changedPost.track, 
    onNowJSON: changedPost.onNowJSON
  });
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
  const { artist, track, onNowJSON } = await chrome.storage.local.get(["artist", "track", "onNowJSON"]);
  return {
    artist,
    track,
    onNowJSON
  }
}
