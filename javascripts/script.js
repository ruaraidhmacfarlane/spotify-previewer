var artistSource = document.getElementById('artist-results-template').innerHTML,
    albumsSource = document.getElementById('album-results-template').innerHTML,
    artistResultsPlaceholder = document.getElementById('artist-results'),
    artistInfoPlaceholder = document.getElementById('artist-info'),
    selectedCssClass = 'selected',
    currentlySelected = null,
    isArtistInfoDisplayed = false;
    
var displayArtistInfo = function(artistData) {
    
    var div = document.createElement('div');
    div.className = 'jumbotron';
    div.setAttribute('id', 'artistDisplay');
    artistInfoPlaceholder.appendChild(div);
    
    displayArtistName(div, artistData.name);
    
    var albumDiv = document.createElement('div');
    albumDiv.className = 'row';
    albumDiv.setAttribute('id', 'album-results');
    div.appendChild(albumDiv);
    
    displayAlbums(albumDiv, artistData.id);
    
    isArtistInfoDisplayed = true;
};

var displayAlbums = function(targetDiv, artistId)
{
    getAlbums(artistId, function (data) {
        var albumsTemplate = Handlebars.compile(albumsSource);
        targetDiv.innerHTML = albumsTemplate(data);
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
    document.getElementById('artistName').innerHTML = artistData.name;
};

var removeArtistInfo = function() {
    isArtistInfoDisplayed = false;
    document.getElementById('artistDisplay').remove();
};

var getArtistData = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId,
        success: function (response) {
            callback(response);
        }
    });
};

var getAlbums = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/albums',
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
        if (target.classList.contains(selectedCssClass)) 
        {
            alert('here');
        }
        else
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
    }
});

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    searchArtist(document.getElementById('query').value);
}, false);


