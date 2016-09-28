document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    alert(document.getElementById('query').value);
}, false);
