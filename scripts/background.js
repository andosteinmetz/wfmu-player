const audio = document.querySelector(".wfmu");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.hasOwnProperty("audioState")) {
    if (request.audioState) {
      start();
    } else {
      stop();
    }
  }
  sendResponse({success: true});
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