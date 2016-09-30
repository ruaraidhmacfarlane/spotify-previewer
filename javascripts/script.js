var artistSource = document.getElementById('artist-results-template').innerHTML,
    topTracksSource = document.getElementById('top-track-results-template').innerHTML,
    artistResultsPlaceholder = document.getElementById('artist-results'),
    artistInfoPlaceholder = document.getElementById('artist-info'),
    selectedCssClass = 'selected',
    playingCssClass = 'playing',
    currentlySelected = null,
    isArtistInfoDisplayed = false,
    audioObject = null;
    
var displayArtistInfo = function(artistData) {
    
    var div = document.createElement('div');
    div.className = 'jumbotron';
    div.setAttribute('id', 'artistDisplay');
    artistInfoPlaceholder.appendChild(div);
    
    displayArtistName(div, artistData.name);
    
    var topTracksDiv = document.createElement('div');
    topTracksDiv.className = 'row';
    topTracksDiv.setAttribute('id', 'topTrackResults');
    div.appendChild(topTracksDiv);
    
    displayTopTracks(topTracksDiv, artistData.id);
    
    isArtistInfoDisplayed = true;
};

var displayTopTracks = function(targetDiv, artistId)
{
    getTopTracks(artistId, function (data) {
        var topTracksTemplate = Handlebars.compile(topTracksSource);
        targetDiv.innerHTML = topTracksTemplate(data);
    });
    
};

var displayArtistName = function(targetDiv, artistName) {
    var header = document.createElement("HEADER");
    targetDiv.appendChild(header);

    var headerClass = document.createElement("H3");
    var artistNameNode = document.createTextNode(artistName);
    headerClass.appendChild(artistNameNode);
    headerClass.setAttribute('id', 'artistName');
    header.appendChild(headerClass); 
};

var updateArtistInfo = function(artistData) {
    if (audioObject) 
    {
        audioObject.pause();
    }
    document.getElementById('artistName').innerHTML = artistData.name;
    displayTopTracks(document.getElementById('topTrackResults'), artistData.id);
};

var removeArtistInfo = function() {
    // document.getElementById('artistDisplay').remove();
    // topTrackPlaceholder()
};

var getArtistData = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId,
        success: function (response) {
            callback(response);
        }
    });
};

var getTopTracks = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks?country=GB',
        success: function (response) {
            callback(response);
        }
    });
};

var getTrack = function (trackId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/tracks/' + trackId,
        success: function (response) {
            callback(response);
        }
    });
};

var searchArtist = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist'
        },
        success: function (response) {
            var artistTemplate = Handlebars.compile(artistSource);
            artistResultsPlaceholder.innerHTML = artistTemplate(response);
            if (isArtistInfoDisplayed)
            {
                removeArtistInfo();
            }
        }
    });
};

artistResultsPlaceholder.addEventListener('click', function (e) {
    var target = e.target;
    if (target !== null && target.classList.contains('artist-image')) 
    {
        if (currentlySelected) 
        {
            currentlySelected.classList.remove(selectedCssClass);
        }

        getArtistData(target.getAttribute('data-artist-id'), function (data) {
            
            target.classList.add(selectedCssClass);
            currentlySelected = target;
            if (isArtistInfoDisplayed)
            {
                updateArtistInfo(data);
            }
            else
            {
                displayArtistInfo(data);
            }
        });
    }
});

artistInfoPlaceholder.addEventListener('click', function (e) {
        var target = e.target;
        if (target !== null && target.classList.contains('album-cover')) 
        {
            if (target.classList.contains(playingCssClass)) {
                audioObject.pause();
            } 
            else 
            {
                if (audioObject) 
                {
                    audioObject.pause();
                }
                getTrack(target.getAttribute('data-track-id'), function (data) {
                    audioObject = new Audio(data.preview_url);
                    audioObject.play();
                    target.classList.add(playingCssClass);
                    
                    audioObject.addEventListener('ended', function () {
                        target.classList.remove(playingCssClass);
                    });
                    audioObject.addEventListener('pause', function () {
                        target.classList.remove(playingCssClass);
                    });
                });
            }
        }
    });

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    searchArtist(document.getElementById('query').value);
}, false);


