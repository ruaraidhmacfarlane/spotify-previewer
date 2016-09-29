var source = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(source),
    resultsPlaceholder = document.getElementById('results');

var searchArtist = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist'
        },
        success: function (response) {
            // resultsPlaceholder.innerHTML = JSON.stringify(response, null, 2);
            resultsPlaceholder.innerHTML = template(response);
        }
    });
};

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    searchArtist(document.getElementById('query').value);
}, false);
