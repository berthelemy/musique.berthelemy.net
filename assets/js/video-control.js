// assets/js/video-control.js

// 1. Global array to store all YouTube player objects
var players = [];

// 2. This function runs automatically once the API script loads
function onYouTubeIframeAPIReady() {
    // Select all iframes with the designated class
    var iframes = document.querySelectorAll('.youtube-player');

    iframes.forEach(function(iframe) {
        // Create a new YT.Player object for each iframe
        var player = new YT.Player(iframe.id, {
            events: {
                // Attach the event listener to the 'onStateChange' event
                'onStateChange': onPlayerStateChange
            }
        });
        // Store the player object in the global array
        players.push(player);
    });
}

// 3. Event handler that fires when a player's state changes (play, pause, etc.)
function onPlayerStateChange(event) {
    // YT.PlayerState.PLAYING has a value of 1
    if (event.data === YT.PlayerState.PLAYING) {
        // If the current video is playing, pause all others
        pauseAllOtherVideos(event.target);
    }
}

// 4. Function to iterate through all players and pause them
function pauseAllOtherVideos(currentPlayer) {
    players.forEach(function(player) {
        // Check if the current player in the loop is NOT the one that just started playing
        if (player !== currentPlayer) {
            // Check if the player object exists and has the 'pauseVideo' method
            if (typeof player.pauseVideo === 'function') {
                player.pauseVideo();
            }
        }
    });
}