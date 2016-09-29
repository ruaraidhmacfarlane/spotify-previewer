var artistSource = document.getElementById('artist-results-template').innerHTML,
    artistTemplate = Handlebars.compile(artistSource),
    artistResultsPlaceholder = document.getElementById('artist-results'),
    artistInfoPlaceholder = document.getElementById('artist-info'),
    selectedCssClass = 'selected',
    currentlySelected = null,
    isArtistDisplayed = false;
    
var displayArtistInfo = function(artistData) {
    var div = document.createElement('div');
    div.className = 'jumbotron';
    div.setAttribute('id', 'artistDisplay');
    artistInfoPlaceholder.appendChild(div);
    
    var header = document.createElement("HEADER");
    div.appendChild(header);

    var headerClass = document.createElement("H3");
    var artistName = document.createTextNode(artistData.name);
    headerClass.appendChild(artistName);
    headerClass.setAttribute('id', 'artistName');
    header.appendChild(headerClass); 
    isArtistDisplayed = true;
}

var updateArtistInfo = function(artistData) {
    document.getElementById('artistName').innerHTML = artistData.name;
}

var removeArtistInfo = function() {
    isArtistDisplayed = false;
    document.getElementById('artistDisplay').remove();
}

var getArtistData = function (artistId, callback) {
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
            if (isArtistDisplayed)
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
                if (isArtistDisplayed)
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
