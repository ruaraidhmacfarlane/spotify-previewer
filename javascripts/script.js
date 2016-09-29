var artistSource = document.getElementById('artist-results-template').innerHTML,
    artistTemplate = Handlebars.compile(artistSource),
    artistResultsPlaceholder = document.getElementById('artist-results'),
    artistInfoPlaceholder = document.getElementById('artist-info'),
    selectedCssClass = 'selected',
    currentlySelected = null,
    artistDisplay = null;
    
var displayArtistInfo = function(artistData) {
    var div = document.createElement('div');
    div.className = 'jumbotron';
    artistInfoPlaceholder.appendChild(div);
    
    var header = document.createElement("HEADER");
    div.appendChild(header);

    var headerClass = document.createElement("H3");
    var artistName = document.createTextNode(artistData.name);
    headerClass.appendChild(artistName);

    header.appendChild(headerClass); 
    artistDisplay = artistInfoPlaceholder;
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
                if (artistDisplay == null)
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
