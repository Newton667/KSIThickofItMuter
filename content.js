console.log("Content script running");

const videoIds = ["At8v_Yc044Y", "tXEPbotEjZE"]; // List of video IDs to mute
let mutedOverlay = null;

// Function to handle video muting and overlay
function handleVideo() {
  const videoElement = document.querySelector('video');

  // Check if the current URL contains one of the target video IDs
  const isTargetVideo = videoIds.some(id => window.location.href.includes(id));

  if (isTargetVideo) {
    console.log("Target video detected");

    if (videoElement) {
      videoElement.muted = true;
      console.log("Video muted successfully");

      if (!mutedOverlay) {
        addMutedOverlay(); // Add the overlay if not already present
      }
    } else {
      console.log("Video element not found");
    }
  } else {
    console.log("Target video not detected");

    // Remove the overlay and unmute if the user navigates away from the specific video
    if (mutedOverlay) {
      removeMutedOverlay();
    }

    if (videoElement) {
      videoElement.muted = false; // Unmute any other videos
    }
  }
}

// Function to add the Muted.png overlay
function addMutedOverlay() {
  const videoContainer = document.querySelector('#movie_player');

  if (videoContainer) {
    mutedOverlay = document.createElement('img');
    mutedOverlay.src = chrome.runtime.getURL('Muted.png');
    mutedOverlay.style.position = 'absolute';
    mutedOverlay.style.top = '50%';
    mutedOverlay.style.left = '50%';
    mutedOverlay.style.transform = 'translate(-50%, -50%)';
    mutedOverlay.style.zIndex = '9999';
    mutedOverlay.style.width = '800px';
    mutedOverlay.style.height = '600px';
    mutedOverlay.style.opacity = '0.9';

    videoContainer.appendChild(mutedOverlay);

    console.log("Centered and large muted overlay added");
  }
}

// Function to remove the Muted.png overlay
function removeMutedOverlay() {
  if (mutedOverlay && mutedOverlay.parentNode) {
    mutedOverlay.parentNode.removeChild(mutedOverlay);
    mutedOverlay = null;
    console.log("Muted overlay removed");
  }
}

// Set up a MutationObserver to detect URL changes (e.g., navigating to a different video)
const observer = new MutationObserver(() => {
  handleVideo();
});

// Start observing changes to the document's body (covers navigation changes)
observer.observe(document.body, { childList: true, subtree: true });

// Initial call to handle video muting and overlay when the page loads
setTimeout(handleVideo, 1000); // Adding a slight delay to make sure everything loads
