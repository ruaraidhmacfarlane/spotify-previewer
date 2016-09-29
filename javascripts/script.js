var artistSource = document.getElementById('artist-results-template').innerHTML,
    artistTemplate = Handlebars.compile(artistSource),
    artistResultsPlaceholder = document.getElementById('artist-results');

var getArtistName = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId,
        success: function (response) {
            callback(response);
        }
    });
}

var searchArtist = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist'
        },
        success: function (response) {
            // resultsPlaceholder.innerHTML = JSON.stringify(response, null, 2);
            artistResultsPlaceholder.innerHTML = artistTemplate(response);
        }
    });
};

artistResultsPlaceholder.addEventListener('click', function (e) {
    var target = e.target;
    if (target !== null && target.classList.contains('artist-image')) {
        var artistName = getArtistName(target.getAttribute('data-artist-id'), function (data) {
            alert(data.name);
        });
        
        // if (target.classList.contains(playingCssClass)) {
        //     audioObject.pause();
        // } else {
        //     if (audioObject) {
        //         audioObject.pause();
        //     }
        //     fetchTracks(target.getAttribute('data-album-id'), function (data) {
        //         audioObject = new Audio(data.tracks.items[0].preview_url);
        //         audioObject.play();
        //         target.classList.add(playingCssClass);
        //         audioObject.addEventListener('ended', function () {
        //             target.classList.remove(playingCssClass);
        //         });
        //         audioObject.addEventListener('pause', function () {
        //             target.classList.remove(playingCssClass);
        //         });
        //     });
        // }
    }
});

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    searchArtist(document.getElementById('query').value);
}, false);


