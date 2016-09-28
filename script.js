var resultsPlaceholder = document.querySelector('#results');

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    resultsPlaceholder.innerHTML = document.getElementById('query').value;
}, false);

