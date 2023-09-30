/**
 * This runs in the background to provide an interface
 * to a global audio object.
 */

const audio = document.querySelector(".wfmu");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.hasOwnProperty("audioState")) {
    if (request.audioState) {
      start();
      sendResponse({success: true});
    } else {
      stop();
      sendResponse({success: true});
    }
  }
});

function start() {
  audio.play();
}

function stop() {
  audio.pause();
}

function isPlaying(){
  return !audio.paused;
}