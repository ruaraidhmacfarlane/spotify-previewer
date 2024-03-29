var artistSource = document.getElementById('artist-results-template').innerHTML,
    topTracksSource = document.getElementById('top-track-results-template').innerHTML,
    artistResultsPlaceholder = document.getElementById('artist-results'),
    topTrackPlaceholder = document.getElementById('top-tracks'),
    nowPlayingPlaceholder = document.getElementById('now-playing'),
    selectedCssClass = 'selected',
    playingCssClass = 'playing',
    currentlySelected = null,
    isArtistInfoDisplayed = false,
    audioObject = null;
    
var displayArtistInfo = function(artistData) {
    
    var div = document.createElement('div');
    div.className = 'row';
    div.setAttribute('id', 'artistDisplay');
    topTrackPlaceholder.appendChild(div);
    
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
    
    headerClass = document.createElement("H4");
    var topTrackNameNode = document.createTextNode("Top Tracks");
    headerClass.appendChild(topTrackNameNode);
    headerClass.setAttribute('id', 'topTrackName');
    header.appendChild(headerClass); 
};

var updateArtistInfo = function(artistData) {
    if (audioObject) 
    {
        audioObject.pause();
        nowPlayingPlaceholder.innerHTML = "";
    }
    document.getElementById('artistName').innerHTML = artistData.name;
    displayTopTracks(document.getElementById('topTrackResults'), artistData.id);
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
        },
        error: function(e) {
            artistResultsPlaceholder.innerHTML = "That search didn't return any results, try searching 'Redpark'...";
        }
    });
};

Handlebars.registerHelper('each_upto', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
});

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

topTrackPlaceholder.addEventListener('click', function (e) {
        var target = e.target;
        if (target !== null && target.classList.contains('album-cover')) 
        {
            if (target.classList.contains(playingCssClass)) {
                audioObject.pause();
                nowPlayingPlaceholder.innerHTML = "";
            } 
            else 
            {
                if (audioObject) 
                {
                    audioObject.pause();
                    nowPlayingPlaceholder.innerHTML = "";
                    
                }
                getTrack(target.getAttribute('data-track-id'), function (data) {
                    audioObject = new Audio(data.preview_url);
                    audioObject.play();
                    target.classList.add(playingCssClass);
                    
                    nowPlayingPlaceholder.innerHTML = '<h4> <strong>Now Playing: </strong><i>' + data.name + '</i></h4>';
                    
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
