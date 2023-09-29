const audioElement = document.createElement('audio');
audioElement.src = 'https://stream0.wfmu.org/freeform-128k.mp3';
const button = document.createElement('button');
button.innerHTML = 'Play WFMU';

let audioPlaying = false;

// chrome.runtime.addEventListener((request, sender, sendResponse) => {
//   if (request.audioState) {
//     audioState = request.audioState;
//   }
// });

button.addEventListener('click', async() => {
  if (audioElement.paused) {
    audioElement.play();
    chrome.runtime.sendMessage({audioState: 'ON'})
    button.innerHTML = 'Pause WFMU';
  } else {
    audioElement.pause();
    button.innerHTML = 'Play WFMU';
    chrome.runtime.sendMessage({audioState: 'OFF'})
  }
});

button.style = 'position: fixed; bottom: 10px; right: 10px; z-index: 9999;';

document.body.appendChild(button);
