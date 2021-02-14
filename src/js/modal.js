(function () {
    var button = document.getElementById('close-button');
    button.onclick = function () {
        window.parent.postMessage({
            type: 'hideFrame'
        }, '*');
    }
}());